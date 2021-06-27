"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tap_1 = require("tap");
const fastify_1 = __importDefault(require("fastify"));
const index_1 = require("../src/index");
tap_1.test('set pageNum 5', async (t) => {
    const server = fastify_1.default();
    const options = { pagesNum: 5 };
    await server.register(index_1.hcPages, options);
    t.teardown(server.close.bind(server));
});
tap_1.test('set pageTimeoutMilliseconds', async (t) => {
    const server = fastify_1.default();
    const options = { pageOptions: { pageTimeoutMilliseconds: 30000 } };
    await server.register(index_1.hcPages, options);
    t.teardown(server.close.bind(server));
});
tap_1.test('set userAgent', async (t) => {
    const server = fastify_1.default();
    const options = { pageOptions: { userAgent: 'testUserAgentString' } };
    await server.register(index_1.hcPages, options);
    t.teardown(server.close.bind(server));
});
tap_1.test('set emulateMediaTypeScreenEnabled', async (t) => {
    const server = fastify_1.default();
    const options = { pageOptions: { emulateMediaTypeScreenEnabled: true } };
    await server.register(index_1.hcPages, options);
    t.teardown(server.close.bind(server));
});
tap_1.test('set acceptLanguage', async (t) => {
    const server = fastify_1.default();
    const options = { pageOptions: { acceptLanguage: 'ja' } };
    await server.register(index_1.hcPages, options);
    t.teardown(server.close.bind(server));
});
tap_1.test('set viewport', async (t) => {
    const server = fastify_1.default();
    const options = { pageOptions: { viewport: { width: 1920, height: 1080 } } };
    await server.register(index_1.hcPages, options);
    t.teardown(server.close.bind(server));
});
//# sourceMappingURL=options.test.js.map