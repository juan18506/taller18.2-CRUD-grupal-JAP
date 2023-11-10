const api = 'https://65451eb65a0b4b04436daa57.mockapi.io/';

const getUsers = async () => {
  const data = await fetch(`${ api }users`);
  const users = await data.json();
  
  return users;
}

const DATA = {
  users: [],
  maxId: 0,
};

getUsers().then(users => {
  DATA.users = users;
  DATA.maxId = 0; 
  users.forEach(user => {
    if (user.id > DATA.maxId) DATA.maxId = user.id;
  });
});

const updateResultList = (id) => {
  const results = document.getElementById('results');
  results.innerHTML = '';

  if (!!id) {
    const user = DATA.users.find(user => user.id === id);

    results.innerHTML += `
      <li class="list-group-item-flush p-3">
        <div>ID: ${ user.id }</div>
        <div>NAME: ${ user.name }</div>
        <div>LASTNAME: ${ user.lastname }</div>
      </li>
    `;

    return;
  }

  DATA.users.forEach(user => {
    results.innerHTML += `
      <li class="list-group-item-flush p-3">
        <div>ID: ${ user.id }</div>
        <div>NAME: ${ user.name }</div>
        <div>LASTNAME: ${ user.lastname }</div>
      </li>
    `;
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('btnGet1').addEventListener('click', async () => {
    results.innerHTML = '';
    const id = document.getElementById('inputGet1Id').value;
    getUsers().then(users => {
      DATA.users = users;
      DATA.maxId = 0;
      users.forEach(user => {
        if (user.id > DATA.maxId) DATA.maxId = user.id;
      });
    });

    console.log(DATA.maxId);
    updateResultList(id);
  });

  document.getElementById('btnPost').addEventListener('click', async () => {
    const name = document.getElementById('inputPostNombre').value;
    const lastName = document.getElementById('inputPostApellido').value;

    if (!name || !lastName) return;

    DATA.users.push({
      id: ++DATA.maxId,
      name: name,
      lastname: lastName,
    });

    await fetch(`${ api }users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DATA.users[DATA.users.length - 1]),
    });

    updateResultList();
  });

  document.getElementById('btnSendChanges').addEventListener('click', async () => {
    const id = document.getElementById('inputPutId').value;
    if (!id) return;

    const name     = document.getElementById('inputPutNombre').value;
    const lastName = document.getElementById('inputPutApellido').value;

    const i = DATA.users.findIndex(user => user.id === id);
    if (i === -1) return;

    if (name) DATA.users[i].name = name;
    if (lastName) DATA.users[i].lastname = lastName;

    await fetch(`${ api }users/${ id }`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DATA.users[i]),
    });

    updateResultList();
  });

  document.getElementById('btnDelete').addEventListener('click', async () => {
    const id = document.getElementById('inputDelete').value;
    if (!id) return;

    await fetch(`${ api }users/${ id }`, {
      method: 'DELETE',
    });

    DATA.users = DATA.users.filter(user => user.id !== id);
    if (id === DATA.maxId) {
      DATA.maxId = 0;
      DATA.users.forEach(user => {
        if (user.id > DATA.maxId) DATA.maxId = user.id;
      });
    };
    console.log(DATA.maxId);

    updateResultList();
  });
});