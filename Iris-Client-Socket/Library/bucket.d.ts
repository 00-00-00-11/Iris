import { Timers } from '../../Iris-Utils';
export declare class Bucket {
    readonly timeout: Timers.Timeout;
    delay: number;
    limit: number;
    locked: boolean;
    queue: Array<any>;
    sent: {
        amount: number;
        reset: number;
    };
    constructor(limit?: number, delay?: number);
    add(throttled: Function, unshift?: boolean): void;
    clear(): void;
    lock(unlockIn?: number): void;
    shift(): void;
    unlock(): void;
}
