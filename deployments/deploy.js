const hre = require("hardhat");

async function main() {
    // Desplegar AuthManager
    const Auth = await hre.ethers.getContractFactory("AuthManager");
    const auth = await Auth.deploy();
    await auth.deployed();
    console.log("const authManagerAddress =", auth.address);

    // Desplegar TaskManager con la dirección de AuthManager
    const Task = await hre.ethers.getContractFactory("TaskManager");
    const task = await Task.deploy(auth.address);
    await task.deployed();
    console.log("const taskManagerAddress =", task.address);

    // Desplegar UserManager
    const User = await hre.ethers.getContractFactory("UserManager");
    const user = await User.deploy();
    await user.deployed();
    console.log("const userManagerAddress =", user.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
