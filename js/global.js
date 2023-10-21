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
