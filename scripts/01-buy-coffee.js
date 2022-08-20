const hre = require("hardhat");

async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
  let balanceId = 0;
  for (const address of addresses) {
    console.log(`Address ${balanceId} has: `, await getBalance(address));
    balanceId++;
  }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timeStamp = memo.timeStamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timeStamp}, ${tipper} said ${message} by tipping from ${tipperAddress}`
    );
  }
}

async function main() {
  // example accounts to work with
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // getting the contract in order to deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();

  await buyMeACoffee.deployed();
  console.log(`buymeacoffee contract deployed to ${buyMeACoffee.address}`);

  // checking the balances
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];

  console.log(`-----------start-----------`);
  await printBalances(addresses);

  // trying out and buying out coffee in actuals
  const tip = { value: hre.ethers.utils.parseEther("1") };
  await buyMeACoffee
    .connect(tipper)
    .buyCoffee("Carolina", "You're the best!", tip);
  await buyMeACoffee
    .connect(tipper2)
    .buyCoffee("Vitto", "Amazing teacher", tip);
  await buyMeACoffee
    .connect(tipper3)
    .buyCoffee("Kay", "I love my Proof of Knowledge", tip);

  console.log(`-----------bought the coffee-----------`);
  await printBalances(addresses);

  // withdrawing the tips
  await buyMeACoffee.connect(owner).withdrawTips();

  // check balances after withdrawing the tips
  console.log(`-----------withdrew the tips-----------`);
  await printBalances(addresses);

  // Check out the memos.
  console.log("== memos ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
