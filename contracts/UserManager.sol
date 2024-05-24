// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract UserManager {
    struct User {
        string name;
        address userAddress;
    }
    
    mapping(address => User) public users;
    address[] private userAddresses;
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    function registerUser(string memory _name, address _userAddress) public {
        require(bytes(_name).length > 0, "Tiene que haber un nombre");
        require(_userAddress != address(0), "direccion de usuario invalida");
        users[_userAddress] = User(_name, _userAddress); // Almacena el nombre y la dirección del usuario
        userAddresses.push(_userAddress);
    }

    //Comprobar 
    function isUserRegistered(address _userAddress) public view returns (bool) {
        return users[_userAddress].userAddress != address(0);
    }
    //Eliminar si no funciona

    
    function getUsers() public view returns (address[] memory, string[] memory) {
        string[] memory userNames = new string[](userAddresses.length);
        for (uint i = 0; i < userAddresses.length; i++) {
            userNames[i] = users[userAddresses[i]].name;
        }
        return (userAddresses, userNames);
    }

    // Mapping para guardar el índice de cada dirección de usuario en el array
    mapping(address => uint) private userIndexes;


    function deleteUser(address _userAddress) public {
        // Verifica si el usuario existe
        require(users[_userAddress].userAddress != address(0), "El usuario no existe");

        // Encuentra la posición del usuario en el array
        uint indexToDelete = userIndexes[_userAddress];

        // Reemplaza el usuario con la última entrada en el array
        address lastUserAddress = userAddresses[userAddresses.length - 1];
        users[_userAddress] = users[lastUserAddress];
        userAddresses[indexToDelete] = lastUserAddress;
        userIndexes[lastUserAddress] = indexToDelete;

        // Elimina la última entrada y reduce la longitud del array
        userAddresses.pop();
        delete users[_userAddress];
        delete userIndexes[_userAddress];
    }

    

    
}
