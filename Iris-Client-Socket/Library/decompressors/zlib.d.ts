/// <reference types="node" />
import { EventSpewer } from '../../../Iris-Utils';
export declare class ZlibDecompressor extends EventSpewer {
    dataChunks: Array<Buffer>;
    chunks: Array<Buffer>;
    chunkSize: number;
    closed: boolean;
    flushing: boolean;
    inflate: any;
    suffix: Buffer;
    constructor(suffix: Buffer, chunkSize?: number);
    close(): void;
    feed(chunk: Buffer): void;
    initialize(): void;
    reset(): void;
    write(): void;
    onData(data: any): void;
    onError(error: any): void;
    onFlush(error: any): void;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: 'data', listener: (data: Buffer) => any): this;
    on(event: 'error', listener: (error: Error) => any): this;
}
