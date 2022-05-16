function getRepos(evt) {
  const searchData = evt.target.value;

  if (searchData) {
    fetch(
      `https://api.github.com/search/repositories?q=${searchData}&per_page=5`
    )
      .then((r) => r.json())
      .then((r) => r.items)
      .then((r) => {
        autocomplete.classList.add('active');
        return r.map((repoName) => {
          const newList = createElement('li', 'search__list');
          newList.textContent = repoName.name;

          newList.addEventListener('click', () => {
            clearSuggestions();
            if (!listWrapper.hasChildNodes()) {
              listWrapper.classList.add('active');
            }

            addRepository(repoName);
          });

          return newList;
        });
      })
      .then((r) => {
        showSuggestions(r);
      })
      .catch(() => {
        showSuggestions([]);
      });
  } else {
    autocomplete.classList.remove('active');
    autocomplete.innerHTML = null;
  }
}

function addRepository(obj) {
  const newList = createElement('li', 'list__repository');

  const textName = createElement('div', 'list__text');
  textName.textContent = 'Name: ' + obj.name;

  const textOwner = createElement('div', 'list__text');
  textOwner.textContent = 'Owner: ' + obj.owner.login;

  const textStars = createElement('div', 'list__text');
  textStars.textContent = 'Stars: ' + obj.stargazers_count;

  const closeButton = createElement('div', 'list__icon');
  closeButton.addEventListener('click', (e) => {
    e.target.parentElement.remove();
    if (!listWrapper.hasChildNodes()) {
      listWrapper.classList.remove('active');
    }
  });

  newList.append(textName);
  newList.append(textOwner);
  newList.append(textStars);
  newList.append(closeButton);

  listWrapper.append(newList);
}

function createElement(el, ...classNames) {
  const newElement = document.createElement(el);
  if (classNames.length) {
    newElement.classList.add(...classNames);
  }

  return newElement;
}

function debounce(fn, debounceTime) {
  let timeout;

  return function () {
    const call = () => fn.apply(this, arguments);

    clearTimeout(timeout);

    timeout = setTimeout(call, debounceTime);
  };
}

function showSuggestions(list) {
  autocomplete.innerHTML = null;
  if (!list.length) {
    autocomplete.textContent = 'Nothing found';
  } else {
    list.map((l) => autocomplete.append(l));
  }
}

function clearSuggestions() {
  input.value = '';
  autocomplete.classList.remove('active');
  autocomplete.innerHTML = null;
}

const listWrapper = document.querySelector('.list');
const searchWrapper = document.querySelector('.search');
const input = searchWrapper.querySelector('.search__input');
const autocomplete = searchWrapper.querySelector('.search__autocomplete');

const debounceGetRepos = debounce(getRepos, 1000);

input.addEventListener('keyup', debounceGetRepos);
