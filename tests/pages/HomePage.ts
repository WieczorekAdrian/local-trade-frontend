import { Page, Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly categoryFilter: Locator;
  readonly adCards: Locator;
  readonly loadingSpinner: Locator;
  readonly emptyStateMessage: Locator;
  readonly clearFiltersButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Najnowsze okazje" });
    this.categoryFilter = page.locator("header .pt-2");
    this.adCards = page.locator(".grid > div");
    this.loadingSpinner = page.locator(".animate-spin");
    this.emptyStateMessage = page.getByText("Brak ogłoszeń w tej kategorii");
    this.clearFiltersButton = page.getByRole("button", { name: "Pokaż wszystkie ogłoszenia" });
  }

  async goto() {
    await this.page.goto("/");
  }

  async selectCategory(categoryName: string) {
    const categoryBtn = this.page.getByRole("button", { name: categoryName });
    await categoryBtn.click();
    await this.loadingSpinner.waitFor({ state: "hidden" });
  }

  async clearFilters() {
    await this.clearFiltersButton.click();
    await this.loadingSpinner.waitFor({ state: "hidden" });
  }

  async getAdCardsCount(): Promise<number> {
    return await this.adCards.count();
  }
}
