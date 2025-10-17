import { test, expect, chromium, firefox, Page } from '@playwright/test';
import {monitorEventLoopDelay} from "node:perf_hooks";


test('workingcookieClicker', async ()  => {
    const userDataDir = './user-data';
    const browser = await firefox.launchPersistentContext(userDataDir,{
        headless:false,
        ignoreHTTPSErrors: true
    });
    const products: any[][] = [];
    const numberOfClicks = 4;
    const page = await browser.newPage();
    await page.goto('https://orteil.dashnet.org/cookieclicker/');
    await page.waitForSelector('#product0');
  await clickBigCookieNumberOfTimes(page,numberOfClicks);
  let cookiesPerSecondBase = await page.locator('#cookiesPerSecond').innerText();
    let cookiesPerSecond = parseNumbers(cookiesPerSecondBase.replace('per second: ', ''));
    // @ts-ignore
  console.log('cookiesPerSecondBase', cookiesPerSecondBase, ': ' , cookiesPerSecond);
    let productsLocator =  await page.locator('//div[@id="products"]//div[@class="content"]')
    let productData = await productsLocator.allInnerTexts();
    console.log(await productsLocator.allInnerTexts());
  for (let i = 0; i < numberOfClicks; i++) {
    await clickBigCookieNumberOfTimes(page,numberOfClicks);
    await page.locator("//div[@id='upgrades']/button[1]").click();
    for (let p = 0; p < productData.length; p++) {
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

      let ratePer = await cleanUpRatePer(rateValue);
      ratePer = removeCommas(ratePer);
      cookiesValue = removeCommas(cookiesValue);
      let nextValue = calculateTimeToPayFor(
        Number(cookiesPerSecond),
        Number(ratePer),
        Number(cookiesValue),
      );
      products[p] = {
        name: nameValue,
        cookies: cookiesValue,
        quantity: quantityValue,
        rate: ratePer,
        next: nextValue,
      };
      // Find the product with the smallest 'next' value
      let minNextIndex = products.reduce((minIdx, prod, idx, arr) =>
        prod.next < arr[minIdx].next ? idx : minIdx, 0);
      console.log('Product with smallest next value:', minNextIndex, products[minNextIndex]);
      await page.locator('#product' + minNextIndex).click();
    }}

    // console.log(products.allTextContents());
    await page.waitForSelector('google');
})

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

function removeCommas(numStr: string) {
  while (numStr.indexOf(',') > -1) {
    numStr = numStr.replace(',','');
  }
  return numStr;
}

function parseNumbers(numberToParse) {
    if (numberToParse.includes(' ')) {
        let numberParts = numberToParse.split(' ');
        switch (numberParts[1]) {
            case 'quadrillion':
                return numberParts[0]*Math.pow(10, 15);
                break;
            case 'quintillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
            case 'sextillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
            case 'septillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
            case 'octillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
            case 'nonillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
            case 'decillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
            case 'undecillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
            case 'duodecillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
            case 'tredecillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
            case 'quattuordecillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
            case 'quindecillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
            case 'sexdecillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
            case 'septendecillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
            case 'octodecillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
            case 'novemdecillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
            case 'vigintillion':
                return numberParts[0]*Math.pow(10, 18);
                break;
        }
    } else {
        return Number(removeCommas(numberToParse));
    }
}
