const { WRCBForecast } = require('./wrcb');
const wrap = require('wordwrap')(80);

const main = async () => {
  const forecast = new WRCBForecast();
  await forecast.fetch();

  console.log(wrap(forecast.toString()));
};

main().then(() => {
  process.exit(0);
});

module.exports = main;
