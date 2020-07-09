const fetch = require('node-fetch');
const moment = require('moment');
const _ = require('lodash');
const htmlToText = require('html-to-text');
const cheerio = require('cheerio');

const WRCB_WX_URL = 'https://wrcb.api.franklyinc.com/weather?clienttype=container.json';

class WRCBForecast {
  forecastFeature = null;

  async fetch() {
    try {
      const res = await fetch(WRCB_WX_URL);
      const wxJSON = await res.json();

      const [wxFeat] = _.sortBy(wxJSON.features, f => moment(f.lastupdatedate), ['desc']).filter(
        f => f.type === 'weather',
      );

      //console.debug('🌦 Latest weather feature:', JSON.stringify(wxFeat));

      this.forecastFeature = wxFeat;
    } catch (e) {
      console.warn(e);
    }
  }

  get forecast() {
    if (this.forecastFeature) {
      // console.debug(`raw forecast---\n`, this.forecastFeature.currentconditions, '\n----\n');

      const $ = cheerio.load(this.forecastFeature.currentconditions);

      $('*').filter((i, el) => {
        const text = $(el).text().trim();
        // console.log(text);
        return text.length > 0;
      });

      $('div').each((i, el) => (el.tagName = 'p'));

      return $.html();
    }

    return undefined;
  }

  get rawForecast() {
    if (this.forecastFeature) {
      return this.forecastFeature.currentconditions;
    }

    return undefined;
  }

  toString() {
    if (this.forecastFeature) {
      const updatedAt = moment(this.forecastFeature.lastupdatedate);

      const updatedAtText = `Last Updated: ${updatedAt.format('LLL')} (${updatedAt.fromNow()})`;
      const forecastText = htmlToText.fromString(this.forecast, {
        wordwrap: 60,
      });

      return [updatedAtText, forecastText].join('\n\n');
    }
  }
}

module.exports = WRCBForecast;
