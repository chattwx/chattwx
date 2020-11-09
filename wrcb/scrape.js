const WRCBForecast = require('./WRCBForecast');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const SCRAPES_DIR = '../scrapes/wrcb';

const scrape = async () => {
  const forecast = new WRCBForecast();
  await forecast.fetch();

  const dateString = forecast.updatedAT.format('YYYY-MM-DD-h:mm:ss');
  const filePath = path.join(__dirname, SCRAPES_DIR, dateString) + '.txt';

  fs.writeFileSync(path.resolve(filePath), forecast.toString());
};

scrape().then(() => {
  process.exit(0);
});

module.exports = scrape;
