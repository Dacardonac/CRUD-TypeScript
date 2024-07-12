import { User } from "./interfaces/interface";

const API_URL = 'http://localhost:3000/users';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm') as HTMLFormElement;
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const avatarInput = document.getElementById('avatar') as HTMLInputElement;
    const userIdInput = document.getElementById('userId') as HTMLInputElement;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userId = userIdInput.value;
        const avatarFile = avatarInput.files?.[0];
        let avatarUrl = '';

        if (avatarFile) {
            avatarUrl = await uploadAvatar(avatarFile);
        }

        const user: Omit<User, 'id'> = {
            name: nameInput.value,
            email: emailInput.value,
            avatar: avatarUrl
        };

        if (userId) {
            await updateUser(parseInt(userId), user);
        } else {
            await createUser(user);
        }

        form.reset();
        fetchUsers();
    });

    fetchUsers();
});

async function uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch('https://api.imgbb.com/1/upload?key=YOUR_API_KEY', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    return data.data.url;
}

async function fetchUsers() {
    const response = await fetch(API_URL);
    const users: User[] = await response.json();
    displayUsers(users);
}

function displayUsers(users: User[]) {
    const userList = document.getElementById('userList');
    if (!userList) return;

    userList.innerHTML = '';
    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.innerHTML = `
      <img src="${user.avatar}" alt="${user.name}" />
      <h4>${user.name}</h4>
      <p>${user.email}</p>
      <button onclick="editUser(${user.id})">Edit</button>
      <button onclick="deleteUser(${user.id})">Delete</button>
    `;
        userList.appendChild(userItem);
    });
}

async function createUser(user: Omit<User, 'id'>) {
    await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
}

async function updateUser(id: number, user: Omit<User, 'id'>) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
}

async function deleteUser(id: number) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    fetchUsers();
}

(window as any).editUser = async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`);
    const user: User = await response.json();

    const userIdInput = document.getElementById('userId') as HTMLInputElement;
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const avatarInput = document.getElementById('avatar') as HTMLInputElement;

    userIdInput.value = user.id.toString();
    nameInput.value = user.name;
    emailInput.value = user.email;
    avatarInput.value = ''; // No podemos establecer un valor para input de tipo 'file'
};

(window as any).deleteUser = async (id: number) => {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    fetchUsers();
};
