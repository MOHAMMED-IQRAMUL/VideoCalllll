import { chromium } from "playwright";
import type { BrowserContext, Page } from "playwright";

const URL = "http://localhost:3000"; 
const SESSION_COUNT = 5;

async function main(): Promise<void> {
  const browser = await chromium.launch({
    headless: false,
  });

  const sessions: Array<{
    context: BrowserContext;
    page: Page;
  }> = [];

  for (let i = 1; i <= SESSION_COUNT; i++) {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(URL, {
      waitUntil: "domcontentloaded",
    });

    console.log(`Session ${i} opened`);

    sessions.push({ context, page });
  }

  // Keep the sessions alive until you press Ctrl+C.
  await new Promise<void>(() => {});
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
