const puppeteer = require('puppeteer');
const autn = require('./credentials');

(async() => {

  let browser;
  let page;

  try {
    browser = await puppeteer.launch({
      headless: false,
    });
    page = await browser.newPage();

    await page.goto('https://skyeng.ru', { waitUntil: 'load' });
    console.log('--- Skyeng.ru page loaded')

    await page.waitForSelector('.b-ff-header__button', {timeout: 5000})
    await page.click('.b-ff-header__button ~ .b-ff-header__button');

    await page.waitForSelector('.b-ff-authPopup__body', {timeout: 5000});
    const elementHandle = await page.$('iframe[src="https://id.skyeng.ru/ru/frame/login?skin=modern"]');
    const frame = await elementHandle.contentFrame();

    await frame.type('.auth__form [name="username"]', autn.username);
    await frame.type('.auth__form [name="password"]', auth.password);
    await frame.click('.auth__form .auth__button');

    try {
      await frame.waitForSelector('.blLoginFormInputError', {timeout: 5000});
      const isAuthFailed = await frame.evaluate(() => document.querySelectorAll('.blLoginFormInputError').length > 0)
      if (isAuthFailed) {
        console.log('\x1b[31m%s\x1b[0m', 'Invalid login or password. Authentication failed');
        await browser.close();
        return;
      }
    } catch {
      console.log('--- Authentication success');
    }

    await page.waitForNavigation({ timeout: 20000});
    console.log('--- Kids onboarding page loaded');
    await page.waitForSelector('sky-widgets-price-board', { timeout: 5000 });
    await page.waitForSelector('.kids-container', { timeout: 5000 })

    console.log('\x1b[32m%s\x1b[0m', 'Everything is fine! Price board on the page');
    await browser.close();

  } catch (err) {
    if (err instanceof puppeteer.errors.TimeoutError) {
      console.log('\x1b[31m%s\x1b[0m', 'Timeout error');
    } else {
      console.log('\x1b[31m%s\x1b[0m', err);
    }
    await browser.close();
  }
})();

