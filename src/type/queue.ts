export class Queue<T> {
    private items: T[] = [];

    enqueue(item: T) {
        this.items.push(item);
    }

    dequeue(): T | undefined {
        return this.items.shift();
    }

    peek(): T | undefined {
        return this.items[0];
    }

    get length() {
        return this.items.length;
    }

    isEmpty() {
        return this.items.length === 0;
    }
}


export class AsyncQueue<T> {
    private items: T[] = [];
    private processing = false;

    enqueue(item: T, handler: (item: T) => Promise<void>) {
        this.items.push(item);
        if (!this.processing) {
            this.run(handler);
        }
    }

    private async run(handler: (item: T) => Promise<void>) {
        this.processing = true;

        while (this.items.length > 0) {
            const item = this.items.shift() as T;
            try {
                await handler(item);
            } catch (e) {
                console.error('job error:', e);
            }
        }

        this.processing = false;
    }
}

