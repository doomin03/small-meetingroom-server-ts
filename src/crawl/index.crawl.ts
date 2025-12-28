// crawler.controller.ts
import { BrowserContext, chromium, Page, Cookie } from 'playwright';
import { Job } from '../type/index.type';
import { Queue } from '../type/queue';

export class CrawlerController {

    private static _instance: CrawlerController | null = null;
    static get instance() {
        if (!this._instance) {
            this._instance = new CrawlerController();
        }
        return this._instance;
    }

    queue: Queue<Job> = new Queue<Job>();

    context!: BrowserContext;
    page!: Page;

    header?: {
        cookie?: string;
        token?: string;
    };

    private constructor() { }

    async build() {
        const browser = await chromium.launch({ headless: false, slowMo: 80 });
        this.context = await browser.newContext();
        this.page = await this.context.newPage();
        this.page.goto(process.env.CRAWL_BASE_URL!)
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

}
