import { Job } from './job';


// Class Algorithm dùng để lập trình và quản lý các thuật toán
export abstract class Algorithm {
    protected isPreemptive: boolean = false; // độ ưu tiên

    processQueue(readyQueue: Job[], currentJob: Job | undefined) {
        if (currentJob && this.isPreemptive) { readyQueue.push(currentJob); }
        readyQueue = this.orderQueue(readyQueue);
        if (currentJob && !this.isPreemptive) { readyQueue.unshift(currentJob); }
    }

    protected orderQueue(readyQueue: Job[]) {
        return readyQueue.sort((a, b) => { return a.compareByArrive(b); });
    }
}

/**
 * Thuật toán "First Come First Serve"
 */
export class FirstComeFirstServe extends Algorithm { }

/**
 * Thuật toán "Shortest job first"

 */
export class ShortestJobFirst extends Algorithm {
    protected override orderQueue(readyQueue: Job[]) {
        return readyQueue.sort((a, b) => { return a.compareByBurst(b); });
    }
}

/**
 * Thuật toán "Shortest time remaining first" hiệu quả hơn so với 3 thuật toán trên
 */
export class STRF extends Algorithm {
    protected override isPreemptive = true;
    protected override orderQueue(readyQueue: Job[]) {
        return readyQueue.sort((a, b) => { return a.compareByRemaining(b); })
    }
}

/**
 * Thuật toán "Round Robin"
 */
export class RoundRobin extends Algorithm {
    quantumTime: number = 2;
    private processTime: number = 0; // thời gian công việc chạy

    override processQueue(readyQueue: Job[], currentJob: Job) {
        if (!currentJob) { this.processTime = 0; return; }
        this.processTime++;
        if (this.processTime === this.quantumTime) {
            readyQueue.push(currentJob);
            this.processTime = 0;
        }
        else {
            readyQueue.unshift(currentJob);
        }
    }
}
