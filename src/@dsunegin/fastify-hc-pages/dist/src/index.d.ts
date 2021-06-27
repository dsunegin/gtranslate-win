/// <reference types="node" />
import { FastifyInstance } from 'fastify';
import { HcPagesOptions, RunOnPageCallback } from '../types/hc-pages';
declare module 'fastify' {
    interface FastifyInstance {
        runOnPage<T>(callback: RunOnPageCallback<T>): Promise<T>;
        destroyPages(): Promise<void>;
    }
}
export declare const plugin: (fastify: FastifyInstance, options: HcPagesOptions, next: (err?: Error | undefined) => void) => Promise<void>;
export declare const hcPages: import("fastify").FastifyPluginCallback<HcPagesOptions, import("http").Server>;
export default hcPages;
