const puppeteer = require('puppeteer');
const WRCB_WX_URL = 'https://www.wrcbtv.com/weather';

class WRCBForecast {
  forecastBlocks = [];
  updatedAT = null;

  async fetch() {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(WRCB_WX_URL);

      //Click the Read More button
      await page.click('.readMore');

      const forecastBlocks = await page.$$eval(
        '.SimpleMeteorologistForecastModal-forecastContent > div',

        divs => {
          return (
            divs
              .map(p => p.innerText)
              // strip out newlines
              .map(b => b.replace('\n', ''))
              // strip out double spaces
              .map(b => b.replace('\n', ''))
              .filter(b => b.length > 0)
          );
        },
      );

      this.forecastBlocks = forecastBlocks;

      this.updatedAT = await page.$eval('.Timestamp-time', span => span.innerText);
    } catch (e) {
      console.warn(e);
      this.forecastBlocks = [];
      this.updatedAT = null;
    }
  }

  toString() {
    return [this.updatedAT, ...this.forecastBlocks].join('\n\n');
  }
}

module.exports = WRCBForecast;
