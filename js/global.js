"use strict";

/**
 * Agregar evento sobre multiples elementos
 */

const addEventOnElements = (elements, eventType, callback) => {
  elements.forEach((element) => {
    element.addEventListener(eventType, callback);
  });
};

/**
 * Activar el cuadro de búsqueda en dispositivo móvil || pantalla pequeña
 */

const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");

addEventOnElements(searchTogglers, "click", () => {
  searchBox.classList.toggle("active");
});

/**
 * Almacenar movieId en localStorage cuando se hace
 * click en cualquier tarjeta de pelicula
 */

const getMovieDetail = function (movieId) {
  window.localStorage.setItem("movieId", String(movieId)); //Almacena el id de la pelicula en el localStorage como string
};
