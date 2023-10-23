"use strict";

import { imageBaseURL } from "./api.js";

/**
 * Tarjeta de pelicula
 */

export function createMovieCard(movie) {
  const { poster_path, title, vote_average, release_date, id } = movie; //Desestructura el objeto movie y obtiene las propiedades poster_path, title, vote_average, release_date, id

  const card = document.createElement("div");
  card.classList.add("movie-card"); //Crea un div con la clase movie-card

  card.innerHTML = `
  <figure class="poster-box card-banner">
  <img
    src="${imageBaseURL}w342${poster_path}"
    alt="${title}"
    class="img-cover"
  />
</figure>

<h4 class="title">${title}</h4>

<div class="meta-list">
  <div class="meta-item">
    <img
      src="./assets/images/star.png"
      width="20"
      loading="lazy"
      alt="Valoración"
    />

    <span class="span">${vote_average.toFixed(1)}</span>
  </div>

  <div class="card-badge">${release_date.split("-")[0]}</div>
</div>

<a
  href="./pages/detail.html"
  title="${title}"
  class="card-btn"
></a>
  
  `;

  return card;
}
