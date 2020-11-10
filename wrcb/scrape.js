const WRCBForecast = require('./WRCBForecast');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const discord = require('../discord');

const SCRAPES_DIR = '../scrapes/wrcb';

const discordConfig = () => {
  return {
    webhook_url: process.env.DISCORD_WEBHOOK_URL,

    avatar_url: 'https://cdn.discordapp.com/attachments/740695875797385238/775508680094777374/unknown.png',
    thumbnail_url: 'https://cdn.discordapp.com/attachments/740695875797385238/775510435658334228/unknown.png',
    embed_url: 'https://www.wrcbtv.com/weather',
    title: 'WRCB Forecast Update',
    color: '57599',
  };
};

const scrape = async () => {
  const forecast = new WRCBForecast({ includeRelativeUpdatedAT: false });
  await forecast.fetch();

  const dateString = forecast.updatedAT.format('YYYY-MM-DD-h:mm:ss');
  const filePath = path.join(__dirname, SCRAPES_DIR, dateString) + '.txt';

  try {
    if (!fs.existsSync(filePath)) {
      const res = await discord.postForecast({ forecast: forecast.toString(), ...discordConfig() });
      console.log(res.status);
      fs.writeFileSync(path.resolve(filePath), forecast.toString());
    } else {
      console.log('This forecast has already been fetched.');
    }
  } catch (e) {
    console.log(e);
  }
};

scrape().then(() => {
  process.exit(0);
});

module.exports = scrape;
