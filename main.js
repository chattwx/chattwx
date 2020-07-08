const { WRCBForecast } = require('./wrcb');

const main = async () => {
  const forecast = new WRCBForecast();
  await forecast.fetch();

  console.log(forecast.toString());
};

main().then(() => {
  process.exit(0);
});

module.exports = main;
