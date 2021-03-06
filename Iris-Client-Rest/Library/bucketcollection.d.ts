import { BaseCollection } from '../../Iris-Utils';
import { Bucket } from './bucket';
export declare class BucketCollection extends BaseCollection<string, Bucket> {
    insert(bucket: Bucket): void;
    resetExpire(bucket: Bucket): void;
    startInterval(): void;
    get [Symbol.toStringTag](): string;
}
