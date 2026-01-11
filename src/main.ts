import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 80 });
  const context = await browser.newContext();
  const page = await context.newPage();


  await page.goto("https://www.snip.or.kr/", { waitUntil: "domcontentloaded" });

  async function clickLogin() {
    const link = page.getByRole("link", { name: "로그인" });
    if (await link.count()) return link.first().click();
  }

  

  // ✅ 현재 쿠키 추출
  const cookies = await context.cookies();
  console.log("cookies:", cookies);

  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ");
  console.log("Cookie:", cookieHeader);

  await browser.close();
})();
