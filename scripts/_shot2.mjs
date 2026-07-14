import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  localStorage.setItem('theme', 'dark');
  document.documentElement.classList.add('dark');
});
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/futebol-dark.png', fullPage: true });
await browser.close();
