'use strict';

module.exports = (NODE) => {
  const yahooFinance = require('yahoo-finance2').default;

  const symbolsOut = NODE.getOutputByName('symbols');

  symbolsOut.on('trigger', async () => (
    (await yahooFinance.trendingSymbols(NODE.data.countryCode))
      .quotes
      .map((quote) => quote.symbol)
  ));
};
