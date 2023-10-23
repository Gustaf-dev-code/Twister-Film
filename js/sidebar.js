"use strict";

import { imageBaseURL, api_key, fetchDataFromServer } from "./api.js";

export const sidebar = () => {
  //Función que se ejecuta al cargar la página
  const genreList = {};

  fetchDataFromServer(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=es-ES}`,
    ({ genres }) => {
      //Función callback que recibe los datos de la petición
      genres.forEach(({ id, name }) => {
        genreList[id] = name; //Crea un objeto con los id y los nombres de los géneros
      });

      genreLink();
    }
  );

  const sidebarInner = document.createElement;
};
