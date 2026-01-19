import "dotenv/config";
import { Job } from "./scheduler/controller.scheduler";
import { scheduler } from "./scheduler/index";
import { ControllerKey, CrawlerKey } from "./type/type";

scheduler.enqueue({
  jobId: 1,
  controllerKey: ControllerKey.CRAWLER,
  workerKey: CrawlerKey.LOGIN,
} satisfies Job);

scheduler.enqueue({
  jobId: 1,
  controllerKey: ControllerKey.CRAWLER,
  workerKey: CrawlerKey.LOGIN,
} satisfies Job);
