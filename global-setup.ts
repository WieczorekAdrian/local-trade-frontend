import { request, chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;

  if (!baseURL) {
    throw new Error("Błąd: baseURL nie jest zdefiniowany w playwright.config.ts");
  }

  const apiBaseURL = baseURL.replace("5173", "8080");

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const requestContext = await request.newContext();

  try {
    console.log(`Rejestracja użytkownika na: ${apiBaseURL}/auth/signup`);

    const signupResponse = await requestContext.post(`${apiBaseURL}/auth/signup`, {
      data: {
        name: "Tester",
        email: "test@example.com",
        password: "password123",
      },
    });

    if (signupResponse.status() === 409) {
      console.log("Użytkownik już istnieje.");
    }

    await page.goto(`${baseURL}/login`);
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Hasło").fill("password123");
    await page.getByRole("button", { name: /zaloguj/i }).click();

    await page.waitForURL(`${baseURL}/`);

    await page.context().storageState({ path: storageState as string });
  } catch (error) {
    console.error("Błąd podczas Global Setup:", error);
    throw error;
  } finally {
    await requestContext.dispose();
    await browser.close();
  }
}

export default globalSetup;
