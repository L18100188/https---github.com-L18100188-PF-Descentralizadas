// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IAuthManager {
    function isUserAuthorized(address _user) external view returns (bool);
}

contract TaskManager {
    struct Task {
        string title;
        string description;
        uint256 dueDate;
        address assignedTo;
        bool completed;
    }
    
    Task[] public tasks;
    address public owner;
    IAuthManager authManager;
    
    constructor(address _authManagerAddress) {
        owner = msg.sender;
        authManager = IAuthManager(_authManagerAddress);
    }
    
    function createTask(string memory _title, string memory _description, uint256 _dueDate, address _assignedTo) public {
        require(authManager.isUserAuthorized(msg.sender), "Solo usuarios autorizados pueden crear tareas");
        tasks.push(Task(_title, _description, _dueDate, _assignedTo, false));
    }
    
    function markTaskCompleted(uint256 _taskIndex) public {
        Task storage task = tasks[_taskIndex];
        //require(task.assignedTo == msg.sender, "Solo el usuario asignado puede completar la tarea");
        task.completed = true;
    }
    
    function getTasks() public view returns (Task[] memory) {
        return tasks;
    }
    
}
