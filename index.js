const API_KEY = "03f14307-72eb-46eb-86a7-d058d6953eda";
const API_URL_FILMS =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=1";
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_INFO = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

getMovies(API_URL_FILMS);

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "X-API-KEY": API_KEY,
      "Content-Type": "application/json",
    },
  });

  const respData = await resp.json();
  showMovies(respData);
}

function showMovies(data) {
  const moviesEl = document.querySelector(".movies");

  document.querySelector(".movies").innerHTML = "";

  if (data.hasOwnProperty("films")) {
    data.films.forEach((item) => {
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");
      movieEl.innerHTML = `<div class="movie-cover-inner">
       <img src="${item.posterUrlPreview}" class="movie-cover" alt="${
        item.nameRu
      }"/>
       <div class="movie-cover-darkened"></div>
       </div>
         <div class="movie-info">
           <div class="movie-title">${item.nameRu}</div>
             <div class="movie-category">${item.genres.map(
               (genre) => ` ${genre.genre}`
             )}</div>
         </div>`;
      movieEl.addEventListener("click", () => openModal(item.filmId));
      moviesEl.append(movieEl);
    });
  } else {
    data.items.forEach((item) => {
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");
      movieEl.innerHTML = `<div class="movie-cover-inner">
       <img src="${item.posterUrlPreview}" class="movie-cover" alt="${
        item.nameRu
      }"/>
       <div class="movie-cover-darkened"></div>
       </div>
         <div class="movie-info">
           <div class="movie-title">${item.nameRu}</div>
             <div class="movie-category">${item.genres.map(
               (genre) => ` ${genre.genre}`
             )}</div>
         </div>`;
      movieEl.addEventListener("click", () => openModal(item.kinopoiskId));
      moviesEl.append(movieEl);
    });
  }
}

const inputBox = document.getElementById("input-box");
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH} ${inputBox.value}`;
  if (inputBox.value) {
    getMovies(apiSearchUrl);
  }
  inputBox.value = "";
});

function searchMovie() {
  if (inputBox.value) {
    getMovies(apiSearchUrl);
  }
  inputBox.value = "";
}

const modalEl = document.querySelector(".modal");

async function openModal(id) {
  const resp = await fetch(API_URL_INFO + id, {
    headers: {
      "X-API-KEY": API_KEY,
      "Content-Type": "application/json",
    },
  });

  const respData = await resp.json();
  modalEl.classList.add("modal-show");
  modalEl.innerHTML = `
  <div class="modal-card">
    <img class="modal-movie-backdrop" src="${respData.posterUrl}" alt="">
    <h2>
      <span class="modal-movie-title">Название - ${respData.nameRu}</span>
    </h2>
    <ul class="modal-movie-info">
      <div class="loader"></div>
      <li class="modal-movie-genre">Жанр - ${respData.genres.map(
        (elem) => `<span> ${elem.genre}</span>`
      )}</li>
      <li >Сайт: <a class="modal-movie-site" href="${respData.webUrl}">${
    respData.webUrl
  }</a></li>
      ${
        respData.description
          ? `<li class="modal-movie-overview">Описание - ${respData.description}</li>`
          : ""
       }
    </ul>
    <button type="button" class="modal-button-close">Закрыть</button>
  </div>
  `;

  const btnClose = document.querySelector(".modal-button-close");
  btnClose.addEventListener("click", () => closeModal());
}

function closeModal() {
  modalEl.classList.remove("modal-show");
}
