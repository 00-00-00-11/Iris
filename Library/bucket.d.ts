import { Timers } from '../Iris-Utils';
export declare class Bucket {
    readonly queue: Array<Function>;
    readonly timeout: Timers.Timeout;
    delay: number;
    executing: boolean;
    limit: number;
    locked: boolean;
    sent: {
        amount: number;
        last: number;
    };
    wait: boolean;
    constructor(limit?: number, delay?: number, wait?: boolean);
    add(throttled: Function, unshift?: boolean): void;
    clear(): void;
    lock(unlockIn?: number): void;
    shift(): void;
    tryLock(): void;
    unlock(): void;
}
