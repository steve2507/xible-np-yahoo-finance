'use strict';

module.exports = (NODE) => {
  const yahooFinance = require('yahoo-finance2').default;

  const symbolsIn = NODE.getInputByName('symbols');

  const pricesOut = NODE.getOutputByName('prices');
  const currenciesOut = NODE.getOutputByName('currencies');
  const dataOut = NODE.getOutputByName('data');

  const getQuotes = async (state) => {
    const symbols = symbolsIn.isConnected()
      ? await symbolsIn.getValues(state)
      : [NODE.data.symbol];

    return Promise.all(symbols.map((symbol) => (
      yahooFinance.quote(symbol)
    )));
  };

  pricesOut.on('trigger', async (conn, state) => {
    const quotes = await getQuotes(state);

    return quotes.map((quote) => quote.regularMarketPrice);
  });

  currenciesOut.on('trigger', async (conn, state) => {
    const quotes = await getQuotes(state);

    return quotes.map((quote) => quote.currency);
  });

  dataOut.on('trigger', async (conn, state) => (
    getQuotes(state)
  ));
};
