"use strict";

const api_key = "60a04469e876cfdd87263de729eea0f7";
const imageBaseURL = "http://image.tmdb.org/t/p/";

/** Fecth data de un servidor usando la "url" y pasando el resultado
 * en formato JSON a una función "callback", junto con un parametro opcional
 * si tiene si tiene "optionalParam"
 */

const fetchDataFromServer = (url, callback, optionalParam) => {
  //Función que recibe la url, la callback y el parametro opcional
  fetch(url) //Hace la petición a la url
    .then((response) => response.json()) //Convierte la respuesta a JSON
    .then((data) => {
      //Ejecuta la callback con los datos y el parametro opcional
      callback(data, optionalParam);
    })
    .catch((error) => console.log(error)); //Si hay un error lo muestra por consola
};

export { imageBaseURL, api_key, fetchDataFromServer }; //Exporta las constantes y la función
