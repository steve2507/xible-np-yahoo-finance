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
      yahooFinance.historical(symbol, { period1: new Date(NODE.data.startDate) })
    )))).flat();
  };

  dataOut.on('trigger', async (conn, state) => (
    getData(state)
  ));
};
