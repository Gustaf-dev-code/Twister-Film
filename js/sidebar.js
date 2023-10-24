"use strict";

import { imageBaseURL, api_key, fetchDataFromServer } from "./api.js";

export const sidebar = () => {
  //Función que se ejecuta al cargar la página

  /**
   * Obtiene todos los géneros ejemplo: [ {id: 28, name: "Acción"}, {id: 12, name: "Aventura"}, ...]
   * entonces cambiamos el array a un objeto con la siguiente estructura: {28: "Acción", 12: "Aventura", ...}
   */
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

  const sidebarInner = document.createElement("div");
  sidebarInner.classList.add("sidebar-inner"); //Crea un div con la clase sidebar-inner
  sidebarInner.innerHTML = `
    <div class="sidebar-list">
      <p class="title">Género</p>
      <a href="./pages/movie-list.html" class="sidebar-link" menu-close
        >Acción</a
      >
      <a href="./pages/movie-list.html" class="sidebar-link" menu-close
        >Terror</a
      >
      <a href="./pages/movie-list.html" class="sidebar-link" menu-close
        >Comedia</a
      >
      <a href="./pages/movie-list.html" class="sidebar-link" menu-close
        >Aventura</a
      >
      <a href="./pages/movie-list.html" class="sidebar-link" menu-close
        >Drama</a
      >
      <a href="./pages/movie-list.html" class="sidebar-link" menu-close
        >Ciencia ficción</a
      >
    </div>

    <div class="sidebar-list">
      <p class="title">Lenguaje</p>
      <a href="./pages/movie-list.html" class="sidebar-link" menu-close
        >Español</a
      >
      <a href="./pages/movie-list.html" class="sidebar-link" menu-close
        >Inglés</a
      >
      <a href="./pages/movie-list.html" class="sidebar-link" menu-close
        >Francés</a
      >
    </div>

    <div class="sidebar-footer">
      <p class="copyright">
        Copyright 2023
        <a href="https://github.com/Gustaf-dev-code/">Gustavo Briceño</a>
      </p>

      <img
        src="./assets/images/tmdb-logo.svg"
        onerror="this.src='../assets/images/tmdb-logo.png'"
        width="130"
        alt="Logo de api de la pelicula"
      />
    </div>
  `; //Añade el html al div creado

  const genreLink = () => {
    Object.entries(genreList).forEach(([genreId, genreName]) => {
      const link = document.createElement("a"); //Crea un elemento a
      link.classList.add("sidebar-link"); //Le añade la clase sidebar-link
      link.setAttribute("href", "./movie-list.html"); //Le añade el atributo href con el valor de la url de la página de películas
      link.setAttribute("menu-close", ""); //Le añade el atributo menu-close
      //   link.setAttribute(
      //     "onclick",
      //     `getMovieList("with_genres = ${genreId}", "${genreName}")`
      //   ); //Le añade el atributo onclick con la función getMovieList y los parametros
      link.textContent = genreName; //Le añade el texto del género
      sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link); //Selecciona todos los elementos con la clase sidebar-list y el primer elemento del array lo añade al sidebar-inner como hijo del primer elemento
    });

    const sidebar = document.querySelector("[sidebar]"); //Selecciona el elemento con el atributo sidebar
    sidebar.appendChild(sidebarInner); //Añade el sidebar-inner al sidebar
    toogleSidebar(sidebar); //Ejecuta la función toogleSidebard pasandole el sidebar
  };

  const toogleSidebar = (sidebar) => {
    //barra lateral retractil in pantalla móvil
    //Función que recibe el sidebar
    const sidebarBtn = document.querySelector("[menu-btn]"); //Selecciona el elemento con el atributo menu-btn
    const sidebarTogglers = document.querySelectorAll("[menu-toggler]"); //Selecciona todos los elementos con el atributo menu-toggler
    const sidebarClose = document.querySelectorAll("[menu-close]"); //Selecciona todos los elementos con el atributo menu-close
    const overlay = document.querySelector("[overlay]"); //Selecciona el elemento con el atributo overlay

    addEventOnElements(sidebarTogglers, "click", () => {
      //Añade el evento click a todos los elementos del array sidebarTogglers
      sidebar.classList.toggle("active"); //Añade o quita la clase active al sidebar
      sidebarBtn.classList.toggle("active"); //Añade o quita la clase active al sidebarBtn
      overlay.classList.toggle("active"); //Añade o quita la clase active al overlay
    });

    addEventOnElements(sidebarClose, "click", () => {
      //Añade el evento click a todos los elementos del array sidebarTogglers
      sidebar.classList.remove("active"); //Añade o quita la clase active al sidebar
      sidebarBtn.classList.remove("active"); //Añade o quita la clase active al sidebarBtn
      overlay.classList.remove("active"); //Añade o quita la clase active al overlay
    });
  };
};
