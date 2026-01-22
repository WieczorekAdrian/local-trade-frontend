import { test as setup } from "@playwright/test";

const STORAGE_STATE = "storageState.json";

setup("rejestracja i logowanie użytkownika", async ({ request, page }) => {
  const apiBaseURL = "http://localhost:8080";
  const baseURL = "http://localhost:5173";

  await request.post(`${apiBaseURL}/auth/signup`, {
    data: {
      name: "Tester",
      email: "test@example.com",
      password: "password123",
    },
  });

  await page.goto(`${baseURL}/login`);
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Hasło").fill("password123");
  await page.getByRole("button", { name: /zaloguj/i }).click();

  await page.waitForURL(`${baseURL}/`);
  await page.context().storageState({ path: STORAGE_STATE });
});
