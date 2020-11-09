const fetch = require('node-fetch');
const moment = require('moment-timezone');
const _ = require('lodash');
const htmlToText = require('html-to-text');
const cheerio = require('cheerio');

const WRCB_WX_URL = 'https://wrcb.api.franklyinc.com/weather?clienttype=container.json';

class WRCBForecast {
  forecastFeature = null;

  constructor({ includeRelativeUpdatedAT = true }) {
    this.opts = {
      includeRelativeUpdatedAT,
    };
  }

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

  get updatedAT() {
    if (this.forecastFeature) {
      return moment(this.forecastFeature.lastupdatedate).tz('America/New_York');
    }

    return undefined;
  }

  toString() {
    if (this.forecastFeature) {
      const updatedAt = this.updatedAT;

      const updatedAtText = this.opts.includeRelativeUpdatedAT
        ? `Last Updated: ${updatedAt.format('LLL')} (${updatedAt.fromNow()})`
        : `Updated: ${updatedAt.format('LLL')}`;
      const forecastText = htmlToText
        .fromString(this.forecast, {
          wordwrap: 60,
        })
        .trim();

      return [updatedAtText, forecastText].join('\n\n').replace(/(\r\n|\r|\n){2,}/g, '$1\n');
    }
  }
}

module.exports = WRCBForecast;
