import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "assets", "demos");

const demos = [
  { name: "pastelaria", url: "https://pastelaria-mu.vercel.app" },
  { name: "ds-fonte", url: "https://ds-story-coral.vercel.app" },
  { name: "lab-reserva", url: "https://labreserva-tcc.vercel.app" },
  { name: "aprendizado7", url: "https://aprendizado7.vercel.app" },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: "pt-BR",
});

for (const demo of demos) {
  const page = await context.newPage();
  console.log(`Capturando ${demo.name}...`);
  try {
    await page.goto(demo.url, { waitUntil: "domcontentloaded", timeout: 120000 });
    // cold start: tenta até a página estabilizar
    await page.waitForTimeout(8000);
    try {
      await page.waitForLoadState("networkidle", { timeout: 60000 });
    } catch {
      console.log(`  networkidle timeout em ${demo.name}, seguindo...`);
    }
    await page.waitForTimeout(2000);
    const jpg = path.join(outDir, `${demo.name}.jpg`);
    await page.screenshot({ path: jpg, type: "jpeg", quality: 82, fullPage: false });
    console.log(`  OK -> ${jpg}`);
  } catch (err) {
    console.error(`  FALHA ${demo.name}:`, err.message);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log("Pronto.");
