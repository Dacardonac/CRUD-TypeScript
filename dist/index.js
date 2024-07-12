var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_URL = 'http://localhost:3000/users';
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const avatarInput = document.getElementById('avatar');
    const userIdInput = document.getElementById('userId');
    form.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        e.preventDefault();
        const userId = userIdInput.value;
        const avatarFile = (_a = avatarInput.files) === null || _a === void 0 ? void 0 : _a[0];
        let avatarUrl = '';
        if (avatarFile) {
            avatarUrl = yield uploadAvatar(avatarFile);
        }
        const user = {
            name: nameInput.value,
            email: emailInput.value,
            avatar: avatarUrl
        };
        if (userId) {
            yield updateUser(parseInt(userId), user);
        }
        else {
            yield createUser(user);
        }
        form.reset();
        fetchUsers();
    }));
    fetchUsers();
});
function uploadAvatar(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = yield fetch('https://api.imgbb.com/1/upload?key=YOUR_API_KEY', {
            method: 'POST',
            body: formData
        });
        const data = yield response.json();
        return data.data.url;
    });
}
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(API_URL);
        const users = yield response.json();
        displayUsers(users);
    });
}
function displayUsers(users) {
    const userList = document.getElementById('userList');
    if (!userList)
        return;
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
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    });
}
function updateUser(id, user) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    });
}
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        fetchUsers();
    });
}
window.editUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${API_URL}/${id}`);
    const user = yield response.json();
    const userIdInput = document.getElementById('userId');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const avatarInput = document.getElementById('avatar');
    userIdInput.value = user.id.toString();
    nameInput.value = user.name;
    emailInput.value = user.email;
    avatarInput.value = ''; // No podemos establecer un valor para input de tipo 'file'
});
window.deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    fetchUsers();
});
export {};
