"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { sidebar } from "./sidebar.js";
import { search } from "./search.js";

const genreName = window.localStorage.getItem("genreName"); //Obtiene el nombre del genero del localStorage
const urlParam = window.localStorage.getItem("urlParam"); // Obtiene el parametro de la url del localStorage
const pageContent = document.querySelector("[page-content]");

sidebar();

let currentPage = 1;
let totalPages = 0;

fetchDataFromServer(
  `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&include_adult=false&language=es-ES&page=${currentPage}&sort_by=popularity.desc&${urlParam}`,
  function ({ results: movieList, total_pages }) {
    totalPages = total_pages; //Guarda el numero total de paginas en la variable totalPages
    document.title = `${genreName} - Twister Film`; //Cambia el titulo de la pagina

    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list", "genre-list"); //Crea un section con la clase movie-list
    movieListElem.ariaLabel = `Películas de ${genreName}`; //Añade un aria-label al section

    movieListElem.innerHTML = `
    <div class="title-wrapper">
    <h1 class="heading">Lista de películas de ${genreName}</h1>
  </div>

  <div class="grid-list">
  </div>

  <button class="btn load-more" load-more>Cargas más...</button>
    `;

    /**
     * Crea una tarjeta de pelicula por cada pelicula en la lista
     */

    for (const movie of movieList) {
      const movieCard = createMovieCard(movie);
      movieListElem.querySelector(".grid-list").appendChild(movieCard);
    }

    pageContent.appendChild(movieListElem); //Añade el section al page-content

    /**
     * Funcionalidad del boton "Cargar más"
     */

    document
      .querySelector("[load-more]")
      .addEventListener("click", function () {
        if (currentPage >= totalPages) {
          //this hace referencia al boton "Cargar más"
          this.style.display = "none"; //Oculta el boton "Cargar más" cuando se llega a la ultima pagina
          return;
        }

        currentPage++; //Incrementa el numero de pagina
        this.classList.add("loading"); //Añade la clase loading al boton "Cargar más"

        fetchDataFromServer(
          `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&include_adult=false&language=es-ES&page=${currentPage}&sort_by=popularity.desc&${urlParam}`,
          ({ results: movieList }) => {
            this.classList.remove("loading"); //Elimina la clase loading del boton "Cargar más"

            for (const movie of movieList) {
              const movieCard = createMovieCard(movie);
              movieListElem.querySelector(".grid-list").appendChild(movieCard); //Añade una tarjeta de pelicula por cada pelicula en la lista
            }
          }
        ); //Obtiene la lista de peliculas de la siguiente pagina))
      });
  }
);

search();
