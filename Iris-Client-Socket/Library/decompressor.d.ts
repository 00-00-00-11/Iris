/// <reference types="node" />
import { EventSpewer } from '../../Iris-Utils';
import { ZlibDecompressor } from './decompressors';
export interface DecompresserOptions {
    type: string;
}
export declare class Decompressor extends EventSpewer {
    closed: boolean;
    decompressor: ZlibDecompressor;
    type: string;
    constructor(options: DecompresserOptions);
    close(): void;
    feed(data: Buffer): void;
    reset(): void;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: 'data', listener: (data: Buffer) => any): this;
    on(event: 'error', listener: (error: Error) => any): this;
    static supported(): Array<string>;
}
