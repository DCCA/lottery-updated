const path = require('path');
const fs = require('fs');
const solc = require('solc');

//find the contract code
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
//read and store the contract content
const source = fs.readFileSync(lotteryPath, 'utf8');

//config the compiler
const input = {
    language: 'Solidity',
    sources: {
        'Lottery.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            },
        },
    },
};
//execute the compiler and exports
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    'Lottery.sol'
].Lottery