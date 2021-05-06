'use strict';

module.exports = (NODE) => {
  const yahooFinance = require('yahoo-finance2').default;

  const symbolsIn = NODE.getInputByName('symbols');

  const dataOut = NODE.getOutputByName('data');

  const getData = async (state) => {
    const symbols = symbolsIn.isConnected()
      ? await symbolsIn.getValues(state)
      : [NODE.data.symbol];

    return (await Promise.all(symbols.map((symbol) => (
      yahooFinance.quoteSummary(symbol, { modules: ['defaultKeyStatistics'] })
    ))))
      .map((data) => data.defaultKeyStatistics)
      .flat();
  };

  dataOut.on('trigger', async (conn, state) => (
    getData(state)
  ));
};
