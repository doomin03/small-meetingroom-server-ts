import { Crawler, Step } from "../base/crawler.base";
import { Page } from "playwright";

export class LoginCralwer extends Crawler {
    constructor(page: Page) {
        super(page)
    }

    async clickLogin() {
        const link = this.page.getByRole("link", { name: "로그인" });
        if (await link.count()) return link.first().click();
    }

    @Step()
    async login(): Promise<[boolean, string]> {
        await this.clickLogin();
        await this.page.waitForLoadState("domcontentloaded");

        let title1 = await this.page.title();
        if (title1.includes("Error")) {
            await this.page.goBack({ waitUntil: "domcontentloaded" });
            await this.clickLogin();
            await this.page.waitForLoadState("domcontentloaded");
            title1 = await this.page.title();
        }

        await this.page.locator('input[type="text"]#id').fill("hamainc");
        await this.page.locator('input[type="password"][id="pass"]').fill("thisHAMA12!@");

        await this.page.getByRole("button", { name: "로그인" }).click();
        await this.page.waitForLoadState("domcontentloaded");

        const title2 = await this.page.title();
        if (title2.includes("Error")) {
            return [false, '로그인 실패'];
        }

        return [true, '로그인 성공'];
    }

}