import { test, expect } from "@playwright/test";

test("powinien wystartować jako zalogowany użytkownik", async ({ page }) => {
  await page.goto("/");

  await expect(page).not.toHaveURL(/\/login/);
  await expect(page.getByText(/Jan Kowalski/i)).toBeVisible();
});
