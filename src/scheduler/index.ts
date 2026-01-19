import { ControllerScheduler } from "./controller.scheduler";
import { ControllerKey, CrawlerKey } from "../type/type";
import { CrawlerController } from "../crawl/controller.crawl";
import { LoginCralwer } from "../crawl/crawler/login.crawler"; 


const controllers = {
  [ControllerKey.CRAWLER]: new CrawlerController({
    [CrawlerKey.LOGIN]: (page) => new LoginCralwer(page),
  }),
} satisfies Record<ControllerKey, { run(workerKey: string): Promise<void> }>;

export const scheduler = new ControllerScheduler(controllers);

