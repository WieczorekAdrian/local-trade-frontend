import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("Strona Logowania - Mocked CI", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          email: "test@example.com",
          name: "Jan Kowalski",
          role: "USER",
        }),
      });
    });
  });

  test("Powinien pomyślnie zalogować użytkownika i przekierować na stronę główną", async ({ page, context }) => {
    const loginPage = new LoginPage(page);

    await context.addCookies([
      {
        name: "auth_session",
        value: "fake_session_id",
        domain: "localhost",
        path: "/",
        expires: Math.floor(Date.now() / 1000) + 3600,
        sameSite: "Lax",
      },
    ]);

    await page.route("**/auth/login", async (route) => {
      console.log("Mock Login HIT!");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          email: "test@example.com",
          name: "Jan Kowalski",
          userId: "user-123-abc",
          role: "USER",
        }),
      });
    });

    await loginPage.goto();

    const responsePromise = page.waitForResponse("**/auth/login");
    await loginPage.login("test@example.com", "password123");
    await responsePromise;

    await expect(page).toHaveURL(/\/$/, { timeout: 20000 });

    await expect(page.getByText(/zalogowano pomyślnie/i)).toBeVisible({ timeout: 15000 });
  });

  test("Powinien pokazać błąd przy nieudanej próbie logowania", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await page.route("**/auth/login", (route) => route.abort("failed"));

    await loginPage.login("bad@user.com", "wrong-pass");

    await expect(page.getByText(/błąd logowania/i)).toBeVisible();
    await expect(page.getByText(/nie udało się połączyć z serwerem/i)).toBeVisible();
  });

  test("Linki nawigacyjne powinny działać poprawnie", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.signupLink.click();
    await expect(page).toHaveURL("/signup");
  });

  test("Nie powinien wysłać formularza z pustymi polami", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.loginButton.click();

    await expect(page).toHaveURL("/login");

    const emailInput = page.getByLabel("Email");
    const isInvalid = await emailInput.evaluate((node: HTMLInputElement) => node.validity.valueMissing);
    expect(isInvalid).toBeTruthy();
  });

  test("Powinien przekierować na login przy wygasłej sesji (401)", async ({ page }) => {
    await page.route("**/auth/login", (route) => route.fulfill({ status: 401 }));

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("test@test.com", "złe-hasło");

    await expect(page).toHaveURL(/\/login/);
  });

  test("Powinien obsłużyć całkowitą awarię serwera (500)", async ({ page }) => {
    await page.route("**/auth/login", (route) => route.fulfill({ status: 500 }));

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("test@test.com", "password");

    await expect(page.getByText(/nie udało się połączyć z serwerem/i)).toBeVisible();
  });

  test("Przycisk powinien być zablokowany podczas wysyłania żądania", async ({ page }) => {
    await page.route("**/auth/login", async (route) => {
      await new Promise((res) => setTimeout(res, 1000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ email: "test@test.com" }),
      });
    });

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login("test@test.com", "pass");

    const button = page.getByRole("button", { name: /logowanie/i });
    await expect(button).toBeDisabled();
    await expect(button).toContainText(/logowanie/i);
  });
});
