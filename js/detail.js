"use strict";

import { imageBaseURL, api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card2.js";
import { sidebar } from "./sidebar.js";

const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

sidebar();

const getGenres = (genres) => {
  let genreList = [];
  genres.forEach((genre) => {
    genreList.push(genre.name);
  });
  return genreList.join(", ");
};

const getCasts = (casts) => {
  let castList = [];
  casts.forEach((cast) => {
    castList.push(cast.name);
  });
  return castList.join(", ");
};

const getDirectors = (crews) => {
  const directors = crews.filter(({ job }) => job === "Director");

  const directorList = [];
  directors.forEach(({ name }) => {
    directorList.push(name);
  });
  return directorList.join(", ");
};

//Esta función filtra los videos que sean de tipo Trailer o Teaser y que sean de YouTube
// y los retorna en un array
const filterVideos = (videos) => {
  return videos.filter(
    ({ type, site }) =>
      (type === "Trailer" || type === "Teaser") && site === "YouTube"
  );
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases&language=es-ES`,
  function (movie) {
    const {
      backdrop_path,
      poster_path,
      title,
      release_date,
      runtime,
      vote_average,
      releases: {
        countries: [{ certification }],
      },
      genres,
      overview,
      casts: { cast, crew },
      videos: { results: videos },
    } = movie;

    document.title = `${title} | Twister Film`;
    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail"); //Crea un div con la clase movie-detail

    movieDetail.innerHTML = `
    <div
          class="backdrop-image"
          style="background-image: url('${imageBaseURL}${
      "w1280" || "original"
    }${backdrop_path || poster_path}')"
        ></div>

        <figure class="poster-box movie-poster">
          <img
            src="${imageBaseURL}w342${poster_path}"
            alt="${title} poster"
            class="img-cover"
          />
        </figure>

        <div class="detail-box">
          <div class="detail-content">
            <h1 class="heading">${title}</h1>
            <div class="meta-list">
              <div class="meta-item">
                <img
                  src="../assets/images/star.png"
                  width="20"
                  alt="Valoración"
                />

                <span class="span">${vote_average.toFixed(1)}</span>
              </div>

              <div class="separator"></div>
              <div class="meta-item">${runtime}m</div>

              <div class="separator"></div>
              <div class="meta-item">${release_date.split("-")[0]}</div>
              <div class="meta-item card-badge">${certification}</div>
            </div>

            <p class="genre">${getGenres(genres)}</p>
            <p class="overview">${overview}</p>

            <ul class="detail-list">
              <div class="list-item">
                <p class="list-name">Protagonizada por:</p>
                <p>${getCasts(cast)}</p>
              </div>

              <div class="list-item">
                <p class="list-name">Dirigida por:</p>
                <p>${getDirectors(crew)}</p>
              </div>
            </ul>
          </div>

          <div class="title-wrapper">
            <h3 class="title-large">Trailers y Clips</h3>
          </div>

          <div class="slider-list">
            <div class="slider-inner"></div>
          </div>
        </div>
    `;

    for (const { key, name } of filterVideos(videos)) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card"); //Crea un div con la clase video-card
      videoCard.innerHTML = `
        <iframe width="500" height"294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0" frameborder="0" allowfullscreen="1" title="${name}" class="img-cover" loading="lazy" ></iframe>
        `;

      movieDetail.querySelector(".slider-inner").appendChild(videoCard); //Agrega el video-card al slider-inner
    }

    pageContent.appendChild(movieDetail); //Agrega el movieDetail al pageContent

    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&language=en-ES&page=1`,
      addSuggestedMovies
    );
  }
);

const addSuggestedMovies = ({ results: movieList }, title) => {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list"); //Crea un section con la clase movie-list
  movieListElem.ariaLabel = "Películas que te pueden interesar"; //Le agrega el atributo aria-label con el valor del título

  movieListElem.innerHTML = `
    <div class="title-wrapper">
            <h3 class="title-large">Películas que te pueden interesar</h3>
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
