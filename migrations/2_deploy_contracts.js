var CannasseurRewards = artifacts.require("./CannasseurRewards.sol");
var CannasseurNetwork = artifacts.require("./CannasseurNetwork.sol");
module.exports = function(deployer) {
  deployer.deploy(CannasseurRewards);
};
