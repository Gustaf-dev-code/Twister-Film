"use strict";

/**
 * Se importan todos los componentes y funciones
 */

import { sidebar } from "./sidebar.js";

import { imageBaseURL, api_key, fetchDataFromServer } from "./api.js";

import { createMovieCard } from "./movie-card.js";

const pageContent = document.querySelector("[page-content]"); //Selecciona el div con el atributo page-content

sidebar();

/**
 * Secciones de la página de inicio (Home) - (Mejor valorados, Próximas películas, Peliculas en tendencias)
 */

const homePageSections = [
  {
    title: "Próximas películas",
    path: "/movie/upcoming",
  },
  {
    title: "Películas en tendencia",
    path: "/trending/movie/week",
  },
  {
    title: "Peliculas mejor valoradas",
    path: "/movie/top_rated",
  },
];

/**
 * Obtiene todos los géneros ejemplo: [ {id: 28, name: "Acción"}, {id: 12, name: "Aventura"}, ...]
 * entonces cambiamos el array a un objeto con la siguiente estructura: {28: "Acción", 12: "Aventura", ...}
 */
const genreList = {
  /**Se crea la cadena de texto de genero a partir de
   * genre_id, ejemplo: [23,43] -> "Aventura, Drama"
   */

  asString(genreIdList) {
    //Función que recibe una lista de id de géneros
    let newGenreList = []; //Crea un array vacío para guardar los nombres de los géneros

    genreIdList.forEach((id) => {
      //Recorre la lista de id de géneros
      newGenreList.push(genreList[id]); //Agrega el nombre del género a la lista
    });

    return newGenreList.join(", "); //Retorna la lista de géneros separados por una coma
  },
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=es-ES}`,
  ({ genres }) => {
    //Función callback que recibe los datos de la petición
    genres.forEach(({ id, name }) => {
      genreList[id] = name; //Crea un objeto con los id y los nombres de los géneros
    });

    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=es-ES&page=2`,
      heroBanner
    );
  }
);

const heroBanner = ({ results: movieList }) => {
  const banner = document.createElement("section");
  banner.classList.add("banner"); //Crea un section con la clase banner
  banner.ariaLabel = "Películas Populares"; //Le agrega el atributo aria-label con el valor "Películas Populares"
  banner.innerHTML = `
  <div class="banner-slider"></div>

        <div class="slider-control">
          <div class="control-inner">
          </div>
        </div>`;

  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item"); //Crea un div con la clase slider-item
    sliderItem.setAttribute("slider-item", ""); //Le agrega el atributo slider-item

    sliderItem.innerHTML = `
    <img
              src="${imageBaseURL}w1280${backdrop_path}"
              alt="${title}"
              class="img-cover"
              loading=${index === 0 ? "eager" : "lazy"}
            />

            <div class="banner-content">
              <h2 class="heading">${title}</h2>

              <div class="meta-list">
                <div class="meta-item card-date">${
                  release_date.split("-")[0]
                }</div>
                <div class="meta-item card-badge">${vote_average.toFixed(
                  1
                )}</div>
              </div>

              <p class="genre">${genreList.asString(genre_ids)}</p>

              <p class="banner-text">${overview}</p>

              <a href="./pages/detail.html" class="btn" onclick="getMovieDetail(${id})" >
                <img
                  src="./assets/images/play_circle.png"
                  width="24"
                  aria-hidden="true"
                  alt="Botón reproducir"
                />
                <span class="span"> Ver Ahora </span>
              </a>
            </div>
    `;

    banner.querySelector(".banner-slider").appendChild(sliderItem); //Agrega el slider-item al banner
    const controlItem = document.createElement("button"); //Crea un botón
    controlItem.classList.add("poster-box", "slider-item"); //Le agrega la clase poster-box y slider-item
    controlItem.setAttribute("slider-control", ` ${controlItemIndex}`); //Le agrega el atributo slider-control con el valor del index
    controlItemIndex++;

    controlItem.innerHTML = `
    <img
        src="${imageBaseURL}w154${poster_path}"
        alt="Control deslizante para ${title}"
        loading="lazy"
        draggable="false"
        class="img-cover"
    />
    `;

    banner.querySelector(".control-inner").appendChild(controlItem); //Agrega el control-item al banner
  }

  pageContent.appendChild(banner); //Agrega el banner al page-content

  addHeroSlide();

  /**
   * Se obtienen los datos para las secciones de la página principal
   * (Mejor valoradas, Películas próximas, Películas en Tendencia)
   */

  for (const { title, path } of homePageSections) {
    fetchDataFromServer(
      `https://api.themoviedb.org/3${path}?api_key=${api_key}&language=es-ES&page=1`,
      createMovieList,
      title
    );
  }
};

/** Funcionalidad del banner deslizante */
const addHeroSlide = function () {
  const sliderItems = document.querySelectorAll("[slider-item]"); //Selecciona todos los elementos con el atributo slider-item
  const sliderControls = document.querySelectorAll("[slider-control]"); //Selecciona todos los elementos con el atributo slider-control

  let lastSliderItem = sliderItems[0]; //Selecciona el primer elemento del array
  let lastSliderControl = sliderControls[0]; //Selecciona el primer elemento del array

  lastSliderItem.classList.add("active"); //Le agrega la clase active al primer elemento del array
  lastSliderControl.classList.add("active"); //Le agrega la clase active al primer elemento del array

  const sliderStart = function () {
    lastSliderItem.classList.remove("active"); //Remueve la clase active del último elemento
    lastSliderControl.classList.remove("active"); //Remueve la clase active del último elemento

    sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
      "active"
    ); //Le agrega la clase active al elemento con el atributo slider-control igual al valor del atributo slider-control del último elemento

    this.classList.add("active"); //Le agrega la clase active al elemento que ejecuta la función sliderStart
    //this = slider-control

    lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))]; //Selecciona el elemento con el atributo slider-control igual al valor del atributo slider-control del último elemento
    lastSliderControl = this; //Selecciona el elemento que ejecuta la función sliderStart
  };

  addEventOnElements(sliderControls, "click", sliderStart); //Añade el evento click a todos los elementos del array sliderControls
};

const createMovieList = ({ results: movieList }, title) => {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list"); //Crea un section con la clase movie-list
  movieListElem.ariaLabel = `${title}`; //Le agrega el atributo aria-label con el valor del título

  movieListElem.innerHTML = `
  <div class="title-wrapper">
          <h3 class="title-large">${title}</h3>
        </div>

        <div class="slider-list">
          <div class="slider-inner">
          </div>
        </div>
  `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie); //Crea una tarjeta de película con los datos de la película. Es llamada desde movie-card.js

    movieListElem.querySelector(".slider-inner").appendChild(movieCard); //Agrega la tarjeta de película al movie-list
  }

  pageContent.appendChild(movieListElem); //Agrega el movie-list al page-content
};
