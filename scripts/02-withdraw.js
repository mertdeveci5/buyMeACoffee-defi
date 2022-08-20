const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
  const contractAddress = "0xF44e019B7cA982CcC0D7eF4258A46ECd727AC1fE";
  const contractAbi = abi.abi;

  //   node and wallet connection
  const provider = new hre.ethers.providers.AlchemyProvider(
    "goerli",
    process.env.GOERLI_API_KEY
  );

  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const buyMeACoffee = new hre.ethers.Contract(
    contractAddress,
    contractAbi,
    signer
  );

  //   check starting balances
  console.log(
    `Current Balance of owner: ${await getBalance(
      provider,
      signer.address
    )} ETH`
  );
  const contractBalance = await getBalance(provider, buyMeACoffee.address);
  console.log(
    `Current balance of contract: ${await getBalance(
      provider,
      buyMeACoffee.address
    )} ETH`
  );

  //   withdraw funds if there are funds
  if (contractBalance != "0.0") {
    console.log(`-----------withdrawing funds-----------`);
    const withdrawTxn = await buyMeACoffee.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log(`no funds to withdraw here`);
  }

  //   checking ending balance
  console.log(
    `Current balance of owner: ${await getBalance(
      provider,
      signer.address
    )} ETH`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.emit(1);
  });
