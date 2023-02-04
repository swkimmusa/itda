const csv = require('csvtojson');
const fs = require('fs');
const _ = require('lodash');

const csvFilePath = './tax-bracket.csv';

const run = async () => {
  const jsonRows = await csv().fromFile(csvFilePath);

  fs.writeFileSync('./src/services/taxBracket.json', JSON.stringify(jsonRows));
  console.log(jsonRows.slice(jsonRows.length - 4));
};

run();
