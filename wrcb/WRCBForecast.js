const fetch = require('node-fetch');
const moment = require('moment');
const _ = require('lodash');
const htmlToText = require('html-to-text');

const WRCB_WX_URL = 'https://wrcb.api.franklyinc.com/weather?clienttype=container.json';

class WRCBForecast {
  updatedAT = null;

  async fetch() {
    try {
      const res = await fetch(WRCB_WX_URL);
      const wxJSON = await res.json();

      const [wxFeat] = _.sortBy(wxJSON.features, f => moment(f.lastupdatedate), ['desc']).filter(
        f => f.type === 'weather',
      );

      // console.debug('🌦 Latest weather feature:', JSON.stringify(wxFeat));

      this.updatedAT = moment(wxFeat.lastupdatedate);
      this.forecast = wxFeat.currentconditions;
    } catch (e) {
      console.warn(e);
      this.forecastBlocks = [];
      this.updatedAT = null;
    }
  }

  toString() {
    const forecastText = htmlToText.fromString(this.forecast, {
      wordwrap: 60,
    });

    return `
      Last Updated: ${this.updatedAT.format('LLL')} (${this.updatedAT.fromNow()})

      ${forecastText}
    `;
  }
}

module.exports = WRCBForecast;
