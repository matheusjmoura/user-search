let tabUsers = null;
let tabStatistics = null;

let allUsers = [];

let textSearch = null;
let btnSearch = null;

let preloader = null;

window.addEventListener('load', () => {
  tabUsers = document.querySelector('#tabUsers');
  tabStatistics = document.querySelector('#tabStatistics');

  textSearch = document.querySelector('#textSearch');
  btnSearch = document.querySelector('#btnSearch');

  preloader = document.querySelector('#preloader');

  numberFormat = Intl.NumberFormat('pt-BR');

  setPreloader();
  fetchUsers();
});

function setPreloader() {
  const preloaderHTML = `
    <div class="progress col s8 offset-s2">
      <div class="indeterminate"></div>
    </div>
  `;
  preloader.innerHTML = preloaderHTML;
  setTimeout(() => {
    preloader.innerHTML = ``;
  }, 2000);
}

async function fetchUsers() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  allUsers = json.results.map((user) => {
    const { name, gender, dob, picture } = user;
    return {
      fullName: `${name.first} ${name.last}`,
      gender,
      age: dob.age,
      picture: picture.thumbnail,
    };
  });
  render();
}

function render() {
  clearList();
  handleSearchButton();
}

function handleSearchButton() {
  textSearch.addEventListener('input', () => {
    const search = textSearch.value.toLowerCase();
    let filterdUsers = allUsers.filter((user) => {
      return user.fullName.toLowerCase().includes(search);
    });
    console.log(filterdUsers);
    if (search == '' || filterdUsers.length == 0) {
      clearList();
    } else {
      renderUserList(filterdUsers);
      renderStatistics(filterdUsers);
    }
  });
}

function clearList() {
  const clearList = `
  <li class="collection-header"><h4>Nenhum usuário filtrado.</h4></li>
  `;
  tabUsers.innerHTML = clearList;
  tabStatistics.innerHTML = clearList;
}

function renderUserList(filterdUsers) {
  let usersHTML = '<li>';
  filterdUsers.map((user) => {
    const { picture, fullName, age } = user;
    const userHTML = `
    <li class="collection-item avatar">
      <img src="${picture}" alt="" class="circle">
      <span class="title">${fullName}</span>
      <p>${age} anos</p>
    </li>
    `;
    usersHTML += userHTML;
  });
  usersHTML += '</li>';
  tabUsers.innerHTML = usersHTML;
}

function renderStatistics(filterdUsers) {
  let totalUsersFound = filterdUsers.length;
  let womankind = filterdUsers.filter((user) => {
    return user.gender.includes('female');
  }).length;
  let mankind =
    filterdUsers.filter((user) => {
      return user.gender.includes('male');
    }).length - womankind;
  let sumAges = filterdUsers.reduce((sum, user) => {
    return sum + user.age;
  }, 0);
  let averageAges = sumAges / totalUsersFound;
  let statsHTML = '<li>';
  filterdUsers.map(() => {
    const statHTML = `
    <li class="collection-header"><h4>Estatísticas</h4></li>
    <li class="collection-item">
      Total de usuários encontrados: <span>${totalUsersFound}</span>
    </li>
    <li class="collection-item">
      Sexo masculino: <span>${mankind}</span>
    </li>
    <li class="collection-item">
      Sexo feminino: <span>${womankind}</span>
    </li>
    <li class="collection-item">
      Soma das idades: <span>${sumAges}</span>
    </li>
    <li class="collection-item">
      Média das idades: <span>${averageAges.toFixed(2)}</span>
    </li>
    `;
    statsHTML = statHTML;
  });
  statsHTML += '</li>';
  tabStatistics.innerHTML = statsHTML;
}
