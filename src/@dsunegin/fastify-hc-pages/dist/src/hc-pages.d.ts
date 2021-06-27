import { BrowserLaunchArgumentOptions, Browser } from 'puppeteer';
import { PageOptions, RunOnPageCallback } from '../types/hc-pages';
export declare class HCPages {
    private pagesNum;
    private pages;
    private readyPages;
    private currentPromises;
    private pageOptions;
    private browser;
    constructor(browser: Browser, pagesNum: number, pageOptions?: Partial<PageOptions> | undefined);
    static init: (pagesNum?: number, pageOptions?: Partial<PageOptions> | undefined, launchOptions?: BrowserLaunchArgumentOptions | undefined) => Promise<HCPages>;
    destroy(): Promise<void>;
    private runCallback;
    runOnPage<T>(callback: RunOnPageCallback<T>): Promise<T>;
    private createPages;
    private applyPageConfigs;
    private closePages;
    private closeBrowser;
}
