import { test, expect } from '@playwright/test';
import path from 'path';

const HARS_DIR = path.join(__dirname, 'hars');

const mockBun = {
  name: 'Краторная булка N-200i'
};

const mockMain = {
  name: 'Биокотлета из марсианской Магнолии'
};

const mockSauce = {
  name: 'Соус Spicy-X'
};

const mockIngredients = async (page: import('@playwright/test').Page) => {
  await page.routeFromHAR(path.join(HARS_DIR, 'ingredients.har'), {
    url: '**/api/ingredients',
    update: false
  });
};

test.describe('Добавление ингредиентов в конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await mockIngredients(page);
    await page.goto('/');
  });

  test('должен добавить булку из списка ингредиентов в конструктор', async ({
    page
  }) => {
    const bunCard = page
      .locator('[data-testid="ingredient-card"]')
      .filter({ hasText: mockBun.name });

    await bunCard.locator('.add-ingredient-button').click();

    await expect(page.getByText(`${mockBun.name} (верх)`)).toBeVisible();
    await expect(page.getByText(`${mockBun.name} (низ)`)).toBeVisible();
  });

  test('должен добавить начинку из списка ингредиентов в конструктор', async ({
    page
  }) => {
    const mainCard = page
      .locator('[data-testid="ingredient-card"]')
      .filter({ hasText: mockMain.name });

    await mainCard.locator('.add-ingredient-button').click();

    await expect(
      page.getByTestId('constructor-ingredients-list').getByText(mockMain.name)
    ).toBeVisible();
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await mockIngredients(page);
    await page.goto('/');
  });

  test('должен открыть модальное окно с данными того ингредиента, по которому кликнули', async ({
    page
  }) => {
    const mainCard = page
      .locator('[data-testid="ingredient-card"]')
      .filter({ hasText: mockMain.name });

    await mainCard.locator('a').click();

    await expect(page.getByTestId('ingredient-details-name')).toBeVisible();
    await expect(page.getByTestId('ingredient-details-name')).toHaveText(
      mockMain.name
    );
  });

  test('должен закрыться по клику на крестик', async ({ page }) => {
    const bunCard = page
      .locator('[data-testid="ingredient-card"]')
      .filter({ hasText: mockBun.name });

    await bunCard.locator('a').click();
    await expect(page.getByTestId('ingredient-details-name')).toBeVisible();

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByTestId('ingredient-details-name')).not.toBeVisible();
  });

  test('должен закрыться по клику на оверлей', async ({ page }) => {
    const bunCard = page
      .locator('[data-testid="ingredient-card"]')
      .filter({ hasText: mockBun.name });

    await bunCard.locator('a').click();
    await expect(page.getByTestId('ingredient-details-name')).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });

    await expect(page.getByTestId('ingredient-details-name')).not.toBeVisible();
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer fake-access-token',
        url: 'http://localhost:4000'
      }
    ]);
    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await mockIngredients(page);
    await page.routeFromHAR(path.join(HARS_DIR, 'user.har'), {
      url: '**/api/auth/user',
      update: false
    });
    await page.routeFromHAR(path.join(HARS_DIR, 'order.har'), {
      url: '**/api/orders',
      update: false
    });

    await page.goto('/');
  });

  test('должен создать заказ и показать корректный номер, затем очистить конструктор', async ({
    page
  }) => {
    const bunCard = page
      .locator('[data-testid="ingredient-card"]')
      .filter({ hasText: mockBun.name });
    const mainCard = page
      .locator('[data-testid="ingredient-card"]')
      .filter({ hasText: mockMain.name });
    const sauceCard = page
      .locator('[data-testid="ingredient-card"]')
      .filter({ hasText: mockSauce.name });

    await bunCard.locator('.add-ingredient-button').click();
    await mainCard.locator('.add-ingredient-button').click();
    await sauceCard.locator('.add-ingredient-button').click();

    await expect(page.getByText(`${mockBun.name} (верх)`)).toBeVisible();

    await page.getByTestId('order-button').click();

    await expect(page.getByTestId('order-number')).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText('12345');

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByTestId('order-number')).not.toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();
  });
});