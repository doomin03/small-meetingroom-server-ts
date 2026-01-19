// crawler.controller.ts
import { BrowserContext, chromium, Page } from 'playwright';
import { Crawler } from "./base/crawler.base";
import { CrawlerKey } from '../type/type';
import { Controller } from '../scheduler/controller.scheduler';


export class CrawlerController implements Controller {

    private ready: Promise<void>;

    context!: BrowserContext;
    page!: Page;

    header?: {
        cookie?: string;
        token?: string;
    };

    constructor(private readonly crawlerFactories: Record<CrawlerKey, (page: Page) => Crawler>) {
        this.ready = this.build();
    }


    private async build() {
        const browser = await chromium.launch({ headless: false, slowMo: 80 });
        this.context = await browser.newContext();
        this.page = await this.context.newPage();
        await this.page.goto(process.env.CRAWL_BASE_URL!, { waitUntil: "domcontentloaded" });
    }

    async setCookies() {
        const cookies = await this.context.cookies();

        const cookieHeader = cookies
            .map((c) => `${c.name}=${c.value}`)
            .join('; ');

        this.header = {
            ...(this.header ?? {}),
            cookie: cookieHeader,
        };
    }

    async run(workerKey: string): Promise<void> {
        await this.ready;
        const key = workerKey as CrawlerKey;
        const factory = this.crawlerFactories[key];
        if (!factory) throw new Error(`Unknown crawlerKey: ${workerKey}`);

        const crawler = factory(this.page);
        const [ok, msg] = await crawler.run();
        if (!ok) throw new Error(msg);
    }

}