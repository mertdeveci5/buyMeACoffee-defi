// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract BuyMeACoffee {
    event NewMemo(
        address indexed from,
        uint256 timeStamp,
        string name,
        string message
    );

    // The struct is a template for the events
    struct Memo {
        address from;
        uint256 timeStamp;
        string name;
        string message;
    }

    // Address of contract deployer. Marked payable so that
    // we can withdraw to this address later.
    address payable owner;

    // Array for the list of all memos
    Memo[] memos;

    constructor() {
        owner = payable(msg.sender);
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    // /**
    //  * @dev buy a coffee for owner (sends an ETH tip and leaves a memo)
    //  * @param _name name of the coffee purchaser
    //  * @param _message a nice message from the purchaser
    //  */

    function buyCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 0, "You must send some ETH");

        // add the memo to the array of memos and storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }
}
