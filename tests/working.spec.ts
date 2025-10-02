import { test, expect, chromium, firefox, Page } from '@playwright/test';


test('workingcookieClicker', async ()  => {
    const userDataDir = './user-data';
    const browser = await firefox.launchPersistentContext(userDataDir,{
        headless:false
    });
    const products: any[][] = [];
    const page = await browser.newPage();
    await page.goto('https://orteil.dashnet.org/cookieclicker/');
    await page.waitForSelector('#product0');
  await clickBigCookieNumberOfTimes(page,1);
  let cookiesPerSecondBase = await page.locator('#cookiesPerSecond').innerText();
    let cookiesPerSecond = Number(cookiesPerSecondBase.replace('per second: ', ''));
    // @ts-ignore
  console.log('cookiesPerSecondBase', cookiesPerSecondBase, ': ' , cookiesPerSecond);
    let productsLocator =  await page.locator('//div[@id="products"]//div[@class="content"]')
    let productData = await productsLocator.allInnerTexts();
    console.log(await productsLocator.allInnerTexts());
    // let products2 =  await page.locator('//div[@id="products"]//div[@class="srOnly"]')
    // console.log(await products2.getAttribute('textContent'));
  for (let i = 0; i < 20; i++) {
    await clickBigCookieNumberOfTimes(page,2);
    for (let p = 0; p < productData.length; p++) {
      console.log(productData[p]);
      await page.locator('#product' + p).hover();
      let nameValue = await page.locator('.name').innerText();
      if (nameValue.includes('???')) {
        break;
      }
      let quantityValue = await page
        .locator('div.tag:nth-child(1)')
        .innerText();
      if (quantityValue.includes('owned: 0')) {
        await page.locator('#product' + p).click();
        break;
      }
      let cookiesValue = await page
        .locator('span.price:nth-child(1)')
        .innerText();
      let rateValue = await page
        .locator('div.descriptionBlock:nth-child(8)')
        .innerText();

      let ratePer = cleanUpRatePer(rateValue);
      let nextValue = calculateTimeToPayFor(
        Number(cookiesPerSecond),
        Number(ratePer),
        Number(cookiesValue.replace(',','')),
      );
      console.log('nextValue', nextValue);
      // let nextValue = p * 11;
      products[p] = {
        name: nameValue,
        cookies: cookiesValue,
        quantity: quantityValue,
        rate: ratePer,
        next: nextValue,
      };
    }
    // } catch(err){
    //     console.log(err);
    // }
  }
    console.log(products);
    // console.log(products.allTextContents());
  console.log("should be products ", productsLocator)
    await page.waitForSelector('google');
})

function howQuickToPayFor(currentRate,changeInRate, cost  ) {
  if (currentRate.includes('e+') || changeInRate.includes('e+') || cost.includes('e+')) {

  } else {

  }

}

function parseNumberString(numStr: string) {
  numStr = numStr.replace('per second: ', '');
  let firstStep = numStr.split('e+');
  if (firstStep.length > 1) {
    console.log('|',firstStep[0],'|');
    return [parseFloat(firstStep[0]), parseInt(firstStep[1])];
  }else
    console.log('|',numStr);
    return [parseInt(numStr.replace(',',''))];
}

function cleanUpPerSecond(numStr: string) {
  return numStr.replace('per second: ', '');
}

function cleanUpRatePer(numStr: string) {
  let parseStep1 = numStr.split('produces ')[1];
  console.log(parseStep1);
  return parseStep1.split(' cookie')[0];
}


async function clickBigCookieNumberOfTimes(page: Page, count: number) {
  const bigCookie = await page.waitForSelector('#bigCookie');
  for (let i = 0; i < count; i++) {
    bigCookie.click();
  }
}

function calculateTimeToPayFor(currentRate:number, additionalRate:number, costOfNext: number) {
  console.log(currentRate, additionalRate, costOfNext);
  return (costOfNext/(currentRate + additionalRate))
}
