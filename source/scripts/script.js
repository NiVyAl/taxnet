function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
};

/* кнопка загрузить еще */
var writeFilmAmount = 5;

var buttonMore = document.querySelector(".button-more");
buttonMore.onclick = function(){
  for (var i = 0; i < moreFilms.length; i++) {
    writeFilm(moreFilms[i]);  
  };
  moreFilms = [];
};
/* */


/* поиск */
var moreFilms = [];
var search = function(data, letter) {
  cleanFilmList();
  var findFilmAmout = 0; 
  moreFilms = [];
  
  for (var i = 0; i < data.length; i++){ 
    for (var j = 0; j < letter.length; j++) {
      if (data[i].title[j].toUpperCase() != letter[j].toUpperCase()) { // выводит ошибку когда введен пробел в названии "тачки 3", но поиск работает 
        break;
      }
      if (j == (letter.length - 1)) {
        if (findFilmAmout < writeFilmAmount) {
          writeFilm(data[i].title, i);
        }; 
        
        if (findFilmAmout >= writeFilmAmount) {
          moreFilms.push(data[i].title);
        }
        findFilmAmout++;
      }
    }
  }
}

var filmsContainer = document.querySelector(".films-container");

var writeFilm = function(filmInf, number, isMark) {
  var film = document.createElement("div");
  filmsContainer.appendChild(film);
  film.className = "films-container__item film";
  
  for (var i = 0; i < favouritesNumbers.length; i++) { // изменение цвета кнопки "добавить в избранное"
    if (number == favouritesNumbers[i]) {
      film.classList.add("film--favourite");
    };  
  };
  
  if (isMark) {
    film.innerHTML = "<p class='film__text'></p><button class='film__favourite-button favourite-button' onclick='addFavourite(" + number + ", true)'></button>";  
  } else {
    film.innerHTML = "<p class='film__text'></p><button class='film__favourite-button favourite-button' onclick='addFavourite(" + number + ")'></button>";
  }

  var filmText = film.querySelector(".film__text");
  filmText.innerHTML = filmInf;
}

var cleanFilmList = function() {
  filmsContainer.innerHTML = " ";
}

var input = document.querySelector(".text-input");

input.oninput = function() {
  loadJSON('jsons/films.json', function(data) {
  search(data, input.value);
});
}


/* добавление в избранное */
var favouritesNumbers = [];
if (localStorage.getItem("favourite")) {
  favouritesNumbers = localStorage.getItem("favourite").split(",")
}

var addFavourite = function(number, isMark) { // запускается при нажатии на кнопку "добавить в избранное"
  var isFavourite = false
  for (var i = 0; i < favouritesNumbers.length; i++) {
      if (favouritesNumbers[i] == number) {
        isFavourite = true;
        favouritesNumbers.splice(i, 1);
      }
  };
  
  if (isFavourite == false) {
    favouritesNumbers.push(number); 
  };
  
  loadJSON('jsons/films.json', function(data) {
      if (isMark) {
        writeFavourite(data);
      } else {
        search(data, input.value);  
      }
    });
  localStorage.setItem("favourite", favouritesNumbers); 
}


/* закладки */

var markButton = document.querySelector("#markButton"); // кнопка закладки
markButton.onclick = function() {
  markButton.classList.add("switch--selected");
  filmButton.classList.remove("switch--selected");
  input.classList.add("visual-hidden");
  
  loadJSON('jsons/films.json', function(data) {
    writeFavourite(data);
  });
}

var writeFavourite = function(data) {
  filmsContainer.innerHTML = " ";
  for (var i = 0; i < favouritesNumbers.length; i++) {
    writeFilm(data[favouritesNumbers[i]].title, favouritesNumbers[i], true);
  }
}


var filmButton = document.querySelector("#filmButton");
filmButton.onclick = function() {
  filmButton.classList.add("switch--selected");
  markButton.classList.remove("switch--selected");
  filmsContainer.innerHTML = " ";
  
  input.classList.remove("visual-hidden");
  loadJSON('jsons/films.json', function(data) {
    search(data, input.value);
  });
}