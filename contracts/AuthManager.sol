// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract AuthManager {
    mapping(address => bool) public authorizedUsers;
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "solo el propietario puede llamar a esta funcion");
        _;
    }
    
    function authorizeUser(address _user) public onlyOwner {
        authorizedUsers[_user] = true;
    }
    
    function deauthorizeUser(address _user) public onlyOwner {
        authorizedUsers[_user] = false;
    }
    
    // Función para comprobar la autorización de un usuario
    function isUserAuthorized(address _user) public view returns (bool) {
        return authorizedUsers[_user];
    }


}
