//SPDX-License-Identifier: MIT

//seting the solidity version
pragma solidity ^0.8.9;

//starting contract
contract Lottery {
    //declaring the manager address
    address public manager;
    //declaring players  array
    address payable[] public players;

    //defining the contract constructor function 
    constructor (){
        //seting the manager from the address that deployed the contract
        manager = msg.sender;
    }

    //enter the lottery function
    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(payable(msg.sender));
    }

    //creating a sudo 'random' function
    function random() private view returns(uint){
        return uint(keccak256(
            abi.encodePacked(
                //var to create a 'random' number
                block.difficulty, 
                block.timestamp, 
                players)));
    }

    //function to pick a winner
    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
    }

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    //function to list players
    function getPlayers() public view returns (address payable[] memory){
        return players;
    }
}
