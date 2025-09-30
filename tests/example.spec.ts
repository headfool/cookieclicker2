import { test, expect, chromium, firefox } from '@playwright/test';


test('cookieClicker', async ()  => {
    const userDataDir = './user-data';
    const browser = await firefox.launchPersistentContext(userDataDir,{
        headless:false
    });
    const products: any[][] = [];
    const page = await browser.newPage();
    await page.goto('https://orteil.dashnet.org/cookieclicker/');
    await page.waitForSelector('#bigCookie');
    let productsLocator =  await page.locator('//div[@id="products"]//div[@class="content"]')
    let productData = await productsLocator.allTextContents();
    console.log(await productsLocator.allInnerTexts());
    // let products2 =  await page.locator('//div[@id="products"]//div[@class="srOnly"]')
    // console.log(await products2.getAttribute('textContent'));
    for (let p = 0; p < productData.length; p++){
        products.push([p]);
        await page.locator('#product'+p).hover()
        let cookiesValue =await page.locator('span.price:nth-child(1)').innerText();
        let quantityValue = await page.locator('div.tag:nth-child(1)').innerText();
        let rateValue = await page.locator('div.descriptionBlock:nth-child(8)').innerText();
        let nameValue = await page.locator('.name').innerText();
        let nextValue = p * 11;
        products[p].push({name: nameValue});
        products[p].push({cookies: cookiesValue});
        products[p].push({quantity: quantityValue});
        products[p].push({rate: rateValue});
        products[p].push({next: nextValue});

    }
    console.log(products);
    // console.log(products.allTextContents());
  console.log("should be products ", productsLocator)
    await page.waitForSelector('google');
})