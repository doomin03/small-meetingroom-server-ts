import { Queue } from "../type/queue";
import { ControllerKey, CrawlerKey } from "../type/type";


export interface Controller {
    run(workerKey: string): Promise<void>;
}

export interface Worker {
    run(workerKey: string): Promise<[boolean, string]>;
}

export interface Job {
    jobId: number,
    controllerKey: ControllerKey,
    workerKey: CrawlerKey,
}


export class ControllerScheduler {
    private jobs = new Queue<Job>();
    private isDraining = false;

    constructor(private readonly controllers: Record<ControllerKey, Controller>) { }

    async enqueue(job: Job) {
        if (!this.controllers[job.controllerKey]) return;

        this.jobs.enqueue(job);

        if (!this.isDraining) {
            await this.drain();
        }
    }

    private async runOnce() {
        const job = this.jobs.dequeue();
        if (!job) return;

        const controller = this.controllers[job.controllerKey];
        await controller.run(job.workerKey);
    }

    private async drain() {
        this.isDraining = true;
        try {
            while (this.jobs.length) {
                await this.runOnce();
            }
        } finally {
            this.isDraining = false;
        }
    }
}
