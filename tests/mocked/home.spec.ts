import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test.describe("Strona Główna - Happy Path (Mocked)", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await page.route("**/categories", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          categories: [
            { categoryId: 1, name: "Elektronika" },
            { categoryId: 2, name: "Inne" },
          ],
        }),
      });
    });

    await page.route("**/advertisements/search*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          content: [
            {
              advertisementId: 1,
              title: "Testowy Smartfon",
              price: 2500,
              categoryId: 1,
              location: "Warszawa",
              active: true,
            },
            {
              advertisementId: 2,
              title: "Stary Monitor",
              price: 150,
              categoryId: 1,
              location: "Kraków",
              active: true,
            },
          ],
        }),
      });
    });

    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("powinna wyświetlić nagłówek i listę najnowszych ogłoszeń", async () => {
    await expect(homePage.heading).toBeVisible();
    await expect(homePage.loadingSpinner).not.toBeVisible();

    const count = await homePage.getAdCardsCount();
    expect(count).toBeGreaterThan(0);
  });

  test("powinna poprawnie filtrować ogłoszenia po wybraniu kategorii", async () => {
    await homePage.selectCategory("Elektronika");
    await expect(homePage.adCards.first()).toBeVisible();
  });
});
