const apiUrl = 'http://localhost:5500';

async function authorizeUser() {
    const userAddress = document.getElementById('authorizeUserAddress').value;
    try {
        const response = await fetch(`${apiUrl}/authorizeUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAddress })
        });
        const data = await response.json();
        document.getElementById('authorizeUserResult').textContent = data.message || data.error;
    } catch (error) {
        document.getElementById('authorizeUserResult').textContent = error.message;
    }
}


async function deauthorizeUser() {
    const userAddress = document.getElementById('deauthorizeUserAddress').value;
    try {
        const response = await fetch(`${apiUrl}/deauthorizeUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAddress })
        });
        const data = await response.json();
        document.getElementById('deauthorizeUserResult').textContent = data.message || data.error;
    } catch (error) {
        document.getElementById('deauthorizeUserResult').textContent = error.message;
    }
}



async function createTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const assignedTo = document.getElementById('taskAssignedTo').value;
    try {
        const response = await fetch(`${apiUrl}/createTask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, dueDate, assignedTo })
        });
        const data = await response.json();
        document.getElementById('createTaskResult').textContent = data.message || data.error;
    } catch (error) {
        document.getElementById('createTaskResult').textContent = error.message;
    }
}



async function registerUser() {
    const name = document.getElementById('userName').value;
    const address = document.getElementById('userAddress').value; // Obtener la dirección del usuario
    try {
        const response = await fetch(`${apiUrl}/registerUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, address }) // Enviar el nombre y la dirección del usuario en el cuerpo de la solicitud
        });
        const data = await response.json();
        document.getElementById('registerUserResult').textContent = data.message || data.error;
    } catch (error) {
        document.getElementById('registerUserResult').textContent = error.message;
    }
}


async function getTasks() {
    try {
        const response = await fetch(`${apiUrl}/tasks`);
        const data = await response.json();
        const tasksList = document.getElementById('tasksList');
        tasksList.innerHTML = '';

        console.log('Received tasks:', data); // Depuración en el navegador

        if (data.tasks && Array.isArray(data.tasks) && data.tasks.length > 0  ) {
            data.tasks.forEach(task => {
                const listItem = document.createElement('li');

                // Desestructuramos las propiedades de la tarea
                const [title, description, dueDate, assignedTo, completed] = task;

                // Convertir dueDate de timestamp a Date si no es undefined o null
                const dueDateFormatted = dueDate ? new Date(dueDate * 1000).toLocaleString() : 'No due date';
                const assignedToFormatted = assignedTo || 'No assigned user';
                const status = completed ? 'Completed' : 'Pending';

                //listItem.textContent = `${title || 'No title'} - ${description || 'No description'} - ${dueDateFormatted} - ${assignedToFormatted} - ${status}`;
                listItem.textContent = `${title || 'No title'} - ${description || 'No description'} - ${assignedToFormatted} - ${status}`;
                tasksList.appendChild(listItem);
            });
        } else {
            tasksList.textContent = 'No hay tareas registradas';
            console.error('Unexpected response format:', data);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}


async function getUserss() {
    try {
        const response = await fetch(`${apiUrl}/users`);
        const data = await response.json();
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';

        console.log('Received data:', data); // Depuración en el navegador

        if (data.users && Array.isArray(data.users) && data.userNames && Array.isArray(data.userNames)) {
            data.users.forEach((user, index) => {
                if (data.userNames[index] !== undefined) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${user} - ${data.userNames[index]}`;
                    usersList.appendChild(listItem);
                }
            });
        } else {
            console.error('Unexpected response format:', data);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function getUsers() {
    try {
        const response = await fetch(`${apiUrl}/users`);
        const data = await response.json();
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';

        console.log('Received data:', data); // Depuración en el navegador

        if (data.users && Array.isArray(data.users) && data.userNames && Array.isArray(data.userNames)) {
            if (data.users.length === 0) {
                const emptyMessage = document.createElement('li');
                emptyMessage.textContent = 'No hay usuarios registrados';
                usersList.appendChild(emptyMessage);
            } else {
                data.users.forEach((user, index) => {
                    if (data.userNames[index] !== undefined) {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${user} - ${data.userNames[index]}`;
                        usersList.appendChild(listItem);
                    }
                });
            }
        } else {
            console.error('Unexpected response format:', data);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}


async function deleteUser() {
    const userAddress = document.getElementById('userAddressD').value;
    console.log(">")
    console.log(userAddress)
    console.log("<")
    try {
   
        const response = await fetch(`${apiUrl}/deleteUser`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAddress })
        });
        const data = await response.json();
        document.getElementById('deleteUserResult').textContent = data.message || data.error;
    } catch (error) {
        document.getElementById('deleteUserResult').textContent = error.message;
    }
}


async function markTaskCompleted() {
    const taskIndex = document.getElementById('taskIndex').value;
    if (isNaN(taskIndex) || taskIndex < 0) {
        document.getElementById('markTaskCompletedResult').textContent = 'Por favor, ingresa un índice de tarea válido';
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/markTaskCompleted`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskIndex: Number(taskIndex) }) // Asegúrate de enviar el índice como número
        });
        
        if (!response.ok) {
            throw new Error('La respuesta del servidor no es válida');
        }

        const data = await response.json();
        document.getElementById('markTaskCompletedResult').textContent = data.message || data.error;
    } catch (error) {
        document.getElementById('markTaskCompletedResult').textContent = error.message;
    }
}

async function checkUserAuthorization() {
    const userAddress = document.getElementById('userAddressC').value;
    try {
        const response = await fetch(`${apiUrl}/isUserAuthorized/${userAddress}`);
        const contentType = response.headers.get('content-type');
        
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('La respuesta del servidor no es JSON');
        }

        const data = await response.json();
        if (response.ok) {
            const isAuthorized = data.isAuthorized;
            if (isAuthorized) {
                document.getElementById('checkUserResult').textContent = `El usuario ${userAddress} está autorizado`;
            } else {
                document.getElementById('checkUserResult').textContent = `El usuario ${userAddress} no está autorizado`;
            }
        } else {
            document.getElementById('checkUserResult').textContent = `Error: ${data.error}`;
        }
    } catch (error) {
        document.getElementById('checkUserResult').textContent = `Error: ${error.message}`;
    }
}


// Seccion de admin

function deshabilitarSeccion(id) {
    const seccion = document.getElementById(id);
    const elementos = seccion.querySelectorAll('input, button, textarea, select');

    elementos.forEach(elemento => {
        elemento.disabled = true;
    });
}

function habilitarSeccionConContrasena(id) {
    const contrasenaCorrecta = "admin123"; 
    const contrasena = prompt("Introduce la contraseña para habilitar la sección:");

    if (contrasena === contrasenaCorrecta) {
        const seccion = document.getElementById(id);
        const elementos = seccion.querySelectorAll('input, button, textarea, select');

        elementos.forEach(elemento => {
            elemento.disabled = false;
        });
    } else {
        alert("Contraseña incorrecta. No se puede habilitar la sección.");
    }
}

//Limpiar campos

function limpiarCampos() {
    // Limpiar inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.value = '');

    // Limpiar párrafos
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(paragraph => paragraph.textContent = '');

    // Limpiar listas
    const lista1 = document.getElementById('tasksList');
    lista1.innerHTML = ''; // Esto elimina todos los elementos hijos dentro de la lista (en este caso, los elementos <li>)

    const lista2 = document.getElementById('usersList');
    lista2.innerHTML = '';
}

// Deshabilitar la sección admin al cargar la página
window.onload = function() {
    deshabilitarSeccion('mi-seccion');
};


