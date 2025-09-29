import { test, expect, chromium, firefox } from '@playwright/test';


test('cookieClicker', async ()  => {
    const userDataDir = './user-data';
    const browser = await firefox.launchPersistentContext(userDataDir,{
        headless:false
    });
    const page = await browser.newPage();
    await page.goto('https://orteil.dashnet.org/cookieclicker/');

})