"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tap_1 = require("tap");
const fastify_1 = __importDefault(require("fastify"));
const index_1 = require("../src/index");
const titleString = 'this is a test title';
const contentHtml = `<html><head><title>${titleString}</title></head><body></body></html>`;
async function build(t) {
    const server = fastify_1.default();
    server.register(index_1.hcPages);
    server.get('/gettitle', async (_, reply) => {
        const result = await server.runOnPage(async (page) => {
            await page.setContent(contentHtml, { waitUntil: 'domcontentloaded' });
            return await page.title();
        });
        reply.send(result);
    });
    t.teardown(server.close.bind(server));
    return server;
}
tap_1.test('runOnPage get title', async (t) => {
    const server = await build(t);
    const res = await server.inject({
        method: 'GET',
        url: '/gettitle',
    });
    t.equal(res.payload, titleString);
});
//# sourceMappingURL=hc-pages.test.js.map