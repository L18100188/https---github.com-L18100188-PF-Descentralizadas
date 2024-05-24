const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la red de Ethereum
const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/yXX2A9btRcV_OzMZ6rqlkIZ96ruBqkpr');
const wallet = new ethers.Wallet('549fc44a3e70e08ff364f8d5c983293af01d6dbd542219bd1313751057906a08', provider);

const authManagerAddress = '0x321DFECd7FF81b31eAcBfe112c19961f11B1964c';
const taskManagerAddress = '0x62897747BF5C3AFC6e8060b81D5E9546de3F406c';
const userManagerAddress = '0x7276e87b3F5034f025D4dad8F3BB60E1A62E80E5';


// Abstracciones de los contratos
const taskManagerABI = require('./artifacts/contracts/TaskManager.sol/TaskManager.json').abi;
const userManagerABI = require('./artifacts/contracts/UserManager.sol/UserManager.json').abi;
const authManagerABI = require('./artifacts/contracts/AuthManager.sol/AuthManager.json').abi;

const taskManagerContract = new ethers.Contract(taskManagerAddress, taskManagerABI, wallet);
const userManagerContract = new ethers.Contract(userManagerAddress, userManagerABI, wallet);
const authManagerContract = new ethers.Contract(authManagerAddress, authManagerABI, wallet);

// Endpoint para autorizar un usuario
app.post('/authorizeUser', async (req, res) => {
  const { userAddress } = req.body;
  try {
        const tx = await authManagerContract.authorizeUser(userAddress);
        await tx.wait();
        res.status(200).json({ message: 'Usuario autorizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Endpoint para desautorizar un usuario
app.post('/deauthorizeUser', async (req, res) => {
    const { userAddress } = req.body;
    try {
        const tx = await authManagerContract.deauthorizeUser(userAddress);
        await tx.wait();
        res.status(200).json({ message: 'Usuario desautorizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para verificar si un usuario está autorizado
app.get('/isUserAuthorized/:userAddress', async (req, res) => {
    const { userAddress } = req.params;
    try {
        const isAuthorized = await authManagerContract.isUserAuthorized(userAddress);
        res.status(200).json({ isAuthorized });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para crear una tarea
app.post('/createTask', async (req, res) => {
    const { title, description, dueDate, assignedTo } = req.body;
    try {

        // Verificar si el usuario está registrado
        const isRegistered = await userManagerContract.isUserRegistered(assignedTo);
        if (!isRegistered) {
            return res.status(403).json({ error: 'Usuario no registrado' });
        }

        // Verificar si el usuario está autorizado
        const isAuthorized = await authManagerContract.isUserAuthorized(assignedTo);
        if (!isAuthorized) {
            return res.status(403).json({ error: 'Usuario no autorizado' });
        }

        

        const tx = await taskManagerContract.createTask(title, description, dueDate, assignedTo);
        await tx.wait();
       res.status(200).json({ message: 'Tarea creada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Endpoint para marcar una tarea como completada
app.post('/markTaskCompleted', async (req, res) => {
    const { taskIndex } = req.body;
    try {
        const tx = await taskManagerContract.markTaskCompleted(taskIndex);
        await tx.wait();
        res.status(200).json({ message: 'Tarea marcada como completada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/tasks', async (req, res) => {
    try {
        const tasks = await taskManagerContract.getTasks();
        console.log('Tasks received from contract:', tasks); // Depuración
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/registerUser', async (req, res) => {
    const { name, address } = req.body; // Se espera que el cuerpo de la solicitud incluya el nombre y la dirección

    // Comprueba si la dirección es una dirección válida de Ethereum
    if (!ethers.utils.isAddress(address)) {
        return res.status(400).json({ error: 'La dirección proporcionada no es válida' });
    }

    try {
        const tx = await userManagerContract.registerUser(name, address); // Registra al usuario con el nombre y la dirección proporcionados
        await tx.wait();
        res.status(200).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Endpoint para eliminar un usuario y su cuenta asociada
app.delete('/deleteUser', async (req, res) => {
    const { userAddress } = req.body;
    try {
        // Verificar si el usuario existe
        const isUser = await userManagerContract.users(userAddress);
        if (isUser.userAddress !== "0x0000000000000000000000000000000000000000") {
            const tx = await userManagerContract.deleteUser(userAddress);
            await tx.wait();
            res.status(200).json({ message: 'Usuario eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'El usuario no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/users', async (req, res) => {
    try {
        const [userAddresses, userNames] = await userManagerContract.getUsers();
        console.log({ users: userAddresses, userNames }); // Depuración en el servidor
        res.status(200).json({ users: userAddresses, userNames });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 5500;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend en funcionamiento en el puerto ${PORT}`);
});