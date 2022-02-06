const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

//importing the contracts copy
const {abi, evm} = require('../compile')

//declare vars for tests
let lottery;
let accounts;

//config tests
beforeEach(async () => {
    //get accounts
    accounts = await web3.eth.getAccounts();
    //get the contract data and deploy to the test network
    lottery = await new web3.eth.Contract(abi)
        .deploy({
            data: evm.bytecode.object
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        })
})
//start tests
describe('Lottery Contracts', () => {
    //test if the contract is deploying
    it('deploys a contract', () => {
        assert.ok(lottery.options.address)
    })
    //check if enter functions is workin
    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        })
        //get the players and check if they entered
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })
        assert.equal(accounts[0], players[0]),
        assert.equal(1, players.length)
    })
    //check if multiple players can enter
    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        })
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        })
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        })
        //get the players and check if they entered
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })
        assert.equal(accounts[0], players[0]),
        assert.equal(accounts[1], players[1]),
        assert.equal(accounts[2], players[2]),
        assert.equal(3, players.length)
    })
    //requires a minimum of ether to enter in the game
    it('requires minimum ether to enter the game', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0,
            })
            assert(false);
        } catch (err){
            assert(err);
        }
    })
    //
    it('only the manager can pick a winner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[0],
            })
            assert(false);
        } catch (err) {
            assert(err);
        }
    })
    //
    it('senbd money to the winner and resets the players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether'),
        });
        //get balance before the lottery
        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        //get the balance after lottery
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        //check difference
        const difference = finalBalance - initialBalance
        assert(difference > web3.utils.toWei('1.8', 'ether'))

    })
})