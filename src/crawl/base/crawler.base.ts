import { chromium, Page } from "playwright";
import { Worker as base } from "../../scheduler/controller.scheduler";


/**
 * 각기 다른 역할을 하는 크롤링 함수를  개별적으로 구분하고 크롤링함수 리스트에 적재를 한다
 * 
 */
export function Step(): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        const ctor = target.constructor as any;

        if (!ctor._steps) {
            ctor._steps = [];
        }

        ctor._steps.push(propertyKey);
    };
}

/**
 * 크롤러를 정의하는 함수로 Step이 있는 함수를 저장하여 RUN을 통해 실행한다
 */

export abstract class Crawler implements base {
    page: Page;
    funcs: Array<() => Promise<[boolean, string]>> = [];
    protected ignoreMethods: string[] = ['constructor', 'run', 'getSteps'];

    constructor(page: Page) {
        this.page = page;
        this.funcs = this.getSteps();
    }

    protected getSteps(): Array<() => Promise<[boolean, string]>> {
        const ctor = this.constructor as any;
        const stepNames: (string | symbol)[] = ctor._steps ?? [];

        return stepNames.map((name) => {
            const fn = (this as any)[name];
            if (typeof fn !== "function") {
                throw new Error(`Step ${String(name)} is not a function`);
            }
            return fn.bind(this) as () => Promise<[boolean, string]>;
        });
    }

    async run(): Promise<[boolean, string]> {
        if (!this.funcs.length) return [true, "실행할 함수 없음"];

        for (const fn of this.funcs) {
            const [ok, msg] = await fn();
            if (!ok) return [false, msg];
        }
        return [true, "모든 함수 실행 성공"];
    }
}

