import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import type { UserResponse } from "@/auth/auth.types";

test.describe("Strona Logowania", () => {
  test("Powinien pomyślnie zalogować użytkownika i przekierować na stronę główną", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.route("**/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: {
          "Set-Cookie": "auth_session=fake_session_id; Path=/; HttpOnly; SameSite=Lax",
        },
        body: JSON.stringify({
          email: "test@example.com",
          ratingCount: 5,
          averageRating: 4.8,
          role: "USER",
          userId: "user-123-abc",
          name: "Jan Kowalski",
        } as UserResponse),
      });
    });

    await loginPage.goto();

    await loginPage.login("test@example.com", "password123");

    await expect(page.getByText(/zalogowano pomyślnie/i)).toBeVisible();

    await expect(page).toHaveURL("/");
  });

  test("Powinien pokazać błąd przy nieudanej próbie logowania", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await page.route("**/auth/login", (route) => route.abort("failed"));

    await loginPage.login("bad@user.com", "wrong-pass");

    await expect(page.getByText("Błąd logowania")).toBeVisible();
    await expect(page.getByText("Nie udało się połączyć z serwerem.")).toBeVisible();
  });

  test("Linki nawigacyjne powinny działać poprawnie", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.signupLink.click();
    await expect(page).toHaveURL("/signup");
  });
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
  await page.route("**/auth/refreshToken", (route) => route.fulfill({ status: 401 }));

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
    await new Promise((res) => setTimeout(res, 5000));
    await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
  });

  const loginPage = new LoginPage(page);
  await loginPage.goto();

  await loginPage.login("test@test.com", "pass");

  const button = page.getByRole("button", { name: /logowanie/i });
  await expect(button).toBeDisabled();
  await expect(button).toContainText("Logowanie...");
});
