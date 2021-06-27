"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hcPages = exports.plugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const hc_pages_1 = require("./hc-pages");
const plugin = async (fastify, options, next) => {
    const { pagesNum, pageOptions, launchOptions } = options;
    const hcPages = await hc_pages_1.HCPages.init(pagesNum, pageOptions, launchOptions);
    fastify.decorate('runOnPage', async (callback) => {
        return await hcPages.runOnPage(callback);
    });
    fastify.decorate('destroyPages', async () => {
        await hcPages.destroy();
    });
    fastify.addHook('onClose', async (instance, done) => {
        await instance.destroyPages();
        done();
    });
    next();
};
exports.plugin = plugin;
exports.hcPages = fastify_plugin_1.default(exports.plugin, {
    fastify: '^3.0.0',
    name: 'hc-pages-plugin',
});
exports.default = exports.hcPages;
//# sourceMappingURL=index.js.map