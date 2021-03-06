/// <reference types="node" />
export declare const DependencyTypes: Readonly<{
    DISCORDJS_OPUS: string;
    NODE_OPUS: string;
    OPUSSCRIPT: string;
}>;
export declare const Applications: Readonly<{
    VOIP: number;
    AUDIO: number;
    RESTRICTED_LOWDELAY: number;
}>;
export declare const CTL: Readonly<{
    BITRATE: number;
    FEC: number;
    PLP: number;
}>;
export declare const MAX_BITRATE = 128000;
export declare const MIN_BITRATE = 16000;
export declare const ValidSampleRates: number[];
export interface AudioOpusOptions {
    application?: number;
    use?: null | string;
}
export declare class AudioOpus {
    opus: any;
    application: number;
    channels: number;
    sampleRate: number;
    use: string;
    constructor(sampleRate: number, channels: number, options?: AudioOpusOptions);
    get module(): any;
    get enabled(): boolean;
    delete(): AudioOpus;
    recreate(): AudioOpus;
    setApplication(value: number): AudioOpus;
    setChannels(value: number): AudioOpus;
    setSampleRate(value: number): AudioOpus;
    setModule(value?: string): AudioOpus;
    setBitrate(bitrate: number): AudioOpus;
    setFEC(enabled: boolean): AudioOpus;
    setPLP(percentage: number): AudioOpus;
    setCTL(flag: number, value: number): AudioOpus;
    decode(buf: Buffer, frameDuration?: number): Buffer;
    encode(buf: Buffer, frameDuration?: number): Buffer;
}
