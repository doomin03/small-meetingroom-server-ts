import { chromium, Page } from "playwright";

export function Step(): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        const ctor = target.constructor as any;

        if (!ctor._steps) {
            ctor._steps = [];
        }

        ctor._steps.push(propertyKey);
    };
}


export abstract class cralwer {
    page!: Page;
    funcs?: Array<() => Promise<[boolean, string]>>;
    protected ignoreMethods: string[] = ['constructor', 'run', 'getSteps'];

    constructor(page: Page) {
        this.page = page;
        this.getSteps();
    }

    protected getSteps(): Promise<[boolean, string]>[] {
        const ctor = this.constructor as any;
        const stepNames: (string | symbol)[] = ctor._steps ?? [];

        return stepNames.map((name) => {
            const fn = (this as any)[name];
            if (typeof fn !== 'function') {
                throw new Error(`Step ${String(name)} is not a function`);
            }
            return fn.bind(this) as Promise<[boolean, string]>;
        });
    }

    async run(): Promise<[boolean, string]> {
        if (!this.funcs || this.funcs.length === 0) {
            return [true, '실행할 함수 없음'];
        }

        for (const fn of this.funcs) {
            const [ok, msg] = await fn();
            if (!ok) {
                return [false, msg];
            }
        }
        return [true, '모든 함수 실행 성공'];
    }

}

