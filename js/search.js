"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

export function search() {
  const searchWrapper = document.querySelector("[search-wrapper]");
  const searchField = document.querySelector("[search-field]");

  const searchResultModal = document.createElement("div");
  searchResultModal.classList.add("search-modal");
  document.querySelector("main").appendChild(searchResultModal);

  let searchTimeOut;

  searchField.addEventListener("input", function () {
    if (!searchField.value.trim()) {
      //Si el campo de busqueda esta vacio se oculta el modal de resultados de busqueda
      searchResultModal.classList.remove("active"); //Oculta el modal de resultados de busqueda
      searchWrapper.classList.remove("searching");
      clearTimeout(searchTimeOut); //Limpia el timeout para que no se ejecute la busqueda, clearTimeOut recibe como parametro el id del timeout que se quiere limpiar
      return;
    }

    searchWrapper.classList.add("searching");
    clearTimeout(searchTimeOut);

    searchTimeOut = setTimeout(function () {
      //Se ejecuta la busqueda despues de 1/2 segundo de que el usuario deje de escribir
      fetchDataFromServer(
        `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searchField.value}&include_adult=false&language=es-ES&page=1`,
        function ({ results: movieList }) {
          searchWrapper.classList.remove("searching");
          searchResultModal.classList.add("active");
          searchResultModal.innerHTML = ""; //Limpia el modal de resultados de busqueda

          searchResultModal.innerHTML = `
            <p class="label">Resultados para:</p>
            <h1 class="heading">${searchField.value}</h1>
            <div class="movie-list">
                 <div class="grid-list"></div>
            </div>
            `;

          if (!movieList.length) {
            //Si la lista de peliculas esta vacia se muestra un mensaje de error
            searchResultModal.innerHTML = `
              <div class="search-error">
                <p>No se encontraron resultados para <strong>${searchField.value}</strong></p>
              </div>
              `;
            searchResultModal.classList.add("active"); //Muestra el modal de resultados de busqueda
            return;
          }

          for (const movie of movieList) {
            const movieCard = createMovieCard(movie);
            searchResultModal
              .querySelector(".grid-list")
              .appendChild(movieCard);
          }

          searchResultModal.classList.add("active"); //Muestra el modal de resultados de busqueda
        }
      );
    }, 500);
  });
}
