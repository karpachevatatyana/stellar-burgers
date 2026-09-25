import { test, expect, Page } from '@playwright/test';
import path from 'path';

const HAR_DIR = path.join(__dirname, 'hars');

const BUN_ID = '643d69a5c3f7b9001cfa093c';
const MAIN_ID = '643d69a5c3f7b9001cfa0941';
const ORDER_NUMBER = '12345';

/**
 * Подключает мок-запросы к API. Перехватывает все запросы через HAR.
 */
const mockApi = async (page: Page) => {
  await page.routeFromHAR(path.join(HAR_DIR, 'ingredients.har'), {
    url: '**/api/ingredients',
    update: false
  });
  await page.routeFromHAR(path.join(HAR_DIR, 'user.har'), {
    url: '**/api/auth/user',
    update: false
  });
  await page.routeFromHAR(path.join(HAR_DIR, 'order.har'), {
    url: '**/api/orders',
    update: false
  });
};

/**
 * Подставляет фейковые токены авторизации в localStorage и cookies.
 */
const setAuthTokens = async (page: Page) => {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer fake-access-token',
      domain: 'localhost',
      path: '/'
    }
  ]);
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'fake-refresh-token');
  });
};

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
  });

  test('должен добавить ингредиенты в конструктор', async ({ page }) => {
    const constructor = page
      .locator('section')
      .filter({ hasText: 'Оформить заказ' });

    // Изначально конструктор пуст
    await expect(constructor.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    // Добавляем булку
    const bunCard = page.getByTestId(`ingredient-${BUN_ID}`);
    const bunAddButton = bunCard.getByRole('button', { name: 'Добавить' });

    // Явно ждём, что кнопка видима и активна (важно для Firefox)
    await expect(bunAddButton).toBeVisible();
    await expect(bunAddButton).toBeEnabled();
    await bunAddButton.scrollIntoViewIfNeeded();
    await bunAddButton.click();

    // Дожидаемся, что булка появилась в конструкторе
    await expect(
      constructor.getByText('Краторная булка N-200i (верх)')
    ).toBeVisible({ timeout: 10000 });
    await expect(
      constructor.getByText('Краторная булка N-200i (низ)')
    ).toBeVisible({ timeout: 10000 });

    // Добавляем начинку
    const mainCard = page.getByTestId(`ingredient-${MAIN_ID}`);
    const mainAddButton = mainCard.getByRole('button', { name: 'Добавить' });

    await expect(mainAddButton).toBeVisible();
    await expect(mainAddButton).toBeEnabled();
    await mainAddButton.scrollIntoViewIfNeeded();
    await mainAddButton.click();

    // Дожидаемся, что начинка появилась
    await expect(
      constructor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible({ timeout: 10000 });

    // Проверяем счётчики на карточках
    await expect(bunCard.locator('.counter__num')).toHaveText('2');
    await expect(mainCard.locator('.counter__num')).toHaveText('1');
  });

  test('должен открыть и закрыть модалку ингредиента по крестику', async ({
    page
  }) => {
    const bunCard = page.getByTestId(`ingredient-${BUN_ID}`);
    await bunCard.locator('a').click();

    // Проверяем, что модалка открылась
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    // Проверяем данные именно этого ингредиента
    await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();
    await expect(modal.getByText('80')).toBeVisible(); // белки
    await expect(modal.getByText('420')).toBeVisible(); // калории

    // Проверяем URL
    await expect(page).toHaveURL(new RegExp(`/ingredients/${BUN_ID}`));

    // Закрываем по крестику
    await page.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();
  });

  test('должен закрыть модалку ингредиента по клику на оверлей', async ({
    page
  }) => {
    const bunCard = page.getByTestId(`ingredient-${BUN_ID}`);
    await bunCard.locator('a').click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    // Клик по оверлею — в левый верхний угол, подальше от модалки
    await page
      .getByTestId('modal-overlay')
      .click({ position: { x: 10, y: 10 } });
    await expect(modal).not.toBeVisible();
  });

  test('должен оформить заказ и очистить конструктор', async ({ page }) => {
    await setAuthTokens(page);
    await page.reload();

    const constructor = page
      .locator('section')
      .filter({ hasText: 'Оформить заказ' });

    // Собираем бургер: булка
    const bunCard = page.getByTestId(`ingredient-${BUN_ID}`);
    const bunAddButton = bunCard.getByRole('button', { name: 'Добавить' });

    await expect(bunAddButton).toBeVisible();
    await expect(bunAddButton).toBeEnabled();
    await bunAddButton.scrollIntoViewIfNeeded();
    await bunAddButton.click();

    await expect(
      constructor.getByText('Краторная булка N-200i (верх)')
    ).toBeVisible({ timeout: 10000 });

    // Собираем бургер: начинка
    const mainCard = page.getByTestId(`ingredient-${MAIN_ID}`);
    const mainAddButton = mainCard.getByRole('button', { name: 'Добавить' });

    await expect(mainAddButton).toBeVisible();
    await expect(mainAddButton).toBeEnabled();
    await mainAddButton.scrollIntoViewIfNeeded();
    await mainAddButton.click();

    await expect(
      constructor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible({ timeout: 10000 });

    // Оформляем заказ
    const orderButton = page.getByRole('button', { name: 'Оформить заказ' });
    await expect(orderButton).toBeVisible();
    await expect(orderButton).toBeEnabled();
    await orderButton.click();

    // Проверяем, что модалка с номером заказа открылась
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText(ORDER_NUMBER);

    // Закрываем модалку
    await page.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();

    // Проверяем, что конструктор пуст
    await expect(constructor.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();
  });
});