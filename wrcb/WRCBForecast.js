const puppeteer = require('puppeteer');
const WRCB_WX_URL = 'https://www.wrcbtv.com/weather';

class WRCBForecast {
  forecastBlocks = [];

  async fetch() {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(WRCB_WX_URL);

      //Click the Read More button
      await page.click('.readMore');

      let forecastBlocks = await page.$$eval('.SimpleMeteorologistForecastModal-forecastContent > div > p', paras =>
        paras
          .map(p => p.innerText)
          // strip out newlines
          .map(b => b.replace('\n', ''))
          // strip out double spaces
          .map(b => b.replace('\n', '')),
      );

      this.forecastBlocks = forecastBlocks;
    } catch (e) {
      console.warn(e);
      this.forecastBlocks = [];
    }
  }

  toString() {
    return this.forecastBlocks.join('\n\n');
  }
}

module.exports = WRCBForecast;
