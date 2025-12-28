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

  await clickLogin();
  await page.waitForLoadState("domcontentloaded");

  const title1 = await page.title();
  if (title1.includes("Error")) {
    await page.goBack({ waitUntil: "domcontentloaded" });
    await clickLogin();
    await page.waitForLoadState("domcontentloaded");
  }

  await page.locator('input[type="text"]#id').fill("hamainc");
  await page.locator('input[type="password"][id="pass"]').fill("thisHAMA12!@");

  // 로그인 클릭 후 네트워크 안정화 대기(원하는 만큼)
  await page.getByRole("button", { name: "로그인" }).click();
  await page.waitForLoadState("domcontentloaded");

  // ✅ 현재 쿠키 추출
  const cookies = await context.cookies();
  console.log("cookies:", cookies);

  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ");
  console.log("Cookie:", cookieHeader);

  await browser.close();
})();
