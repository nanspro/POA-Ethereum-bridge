var Bridge = artifacts.require("Side");

module.exports = function(deployer) {
    deployer.deploy(Bridge, 1, ["0x41a06892815a450c8bB7297C65290a0864871677"]);
};