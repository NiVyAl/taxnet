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
var writenFilmsAmount = writeFilmAmount;

var buttonMore = document.querySelector(".button-more");
buttonMore.onclick = function(){
  if ((films.length - writenFilmsAmount) > writeFilmAmount) {
    for (var i = writenFilmsAmount; i < writenFilmsAmount+writeFilmAmount; i++) {
      films[i].classList.remove("visual-hidden");
    }
    writenFilmsAmount = writenFilmsAmount + writeFilmAmount
  } else {
    for (var i = writenFilmsAmount; i < films.length; i++) {
      films[i].classList.remove("visual-hidden");
    }
    writenFilmsAmount = films.length;
    buttonMore.classList.add("visual-hidden");
  };
};
/* */


/* поиск */
var films;
var search = function(data, letter) {
  writenFilmsAmount = writeFilmAmount; // количество выведенных
  cleanFilmList();
  var findFilmAmout = 0; 

  
  for (var i = 0; i < data.length; i++) {
    
    for (var j = 0; j < letter.length; j++) {
      if (data[i].title[j].toUpperCase() != letter[j].toUpperCase()) { // выводит ошибку когда введен пробел в названии "тачки 3", но поиск работает 
        break;
      }
      if (j == (letter.length - 1)) {

        if (tagsSelected.length > 0) {        // выбраны ли теги
          var tagsFind = 0;
          for (var k = 0; k < tagsSelected.length; k++) {
            for (var c = 0; c < data[i].tags.length; c++) {
              if (tagsSelected[k] == data[i].tags[c]) {
                tagsFind++;
              } 
            } 
          };
          if (tagsFind == tagsSelected.length) {
            writeFilm(data[i].title, i);
            findFilmAmout++;
          }
        } else {
          writeFilm(data[i].title, i);
          findFilmAmout++;
        }
        
      }
    }
  }
  if (findFilmAmout > writeFilmAmount) {
    buttonMore.classList.remove("visual-hidden");
    films = document.querySelectorAll(".film")
    for (var i = writeFilmAmount; i < films.length; i++) {
      films[i].classList.add("visual-hidden");
    }
  } else {
    buttonMore.classList.add("visual-hidden");
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
  tagsContainer.classList.add("visual-hidden");
  markButton.classList.add("switch--selected");
  filmButton.classList.remove("switch--selected");
  input.classList.add("visual-hidden");
  
  loadJSON('jsons/films.json', function(data) {
    writeFavourite(data);
  });
}

var writeFavourite = function(data) {
  writenFilmsAmount = writeFilmAmount;
  cleanFilmList();
  for (var i = 0; i < favouritesNumbers.length; i++) {
    writeFilm(data[favouritesNumbers[i]].title, favouritesNumbers[i], true);
  }
  
  if (favouritesNumbers.length > writeFilmAmount) { // вывод только первых пятнадцати
    buttonMore.classList.remove("visual-hidden");
    films = document.querySelectorAll(".film")
    for (var i = writeFilmAmount; i < films.length; i++) {
      films[i].classList.add("visual-hidden");
    }
  } else {
    buttonMore.classList.add("visual-hidden");
  }
}


var filmButton = document.querySelector("#filmButton");
filmButton.onclick = function() {
  tagsContainer.classList.remove("visual-hidden");
  filmButton.classList.add("switch--selected");
  markButton.classList.remove("switch--selected");
  cleanFilmList();
  
  input.classList.remove("visual-hidden");
  loadJSON('jsons/films.json', function(data) {
    search(data, input.value);
  });
}


/* теги */
var tagsContainer = document.querySelector(".tags-container");
loadJSON('jsons/tags.json', function(data) { //выводим первые пять тегов
    for (var i = 0; i < 5; i++) { 
      writeTag(data[i], i);
    }
  });

var moreTagsContainer = [];
var tagsMoreButton = document.querySelector(".tags-container__button"); 
var isMoreTags = false;
tagsMoreButton.onclick = function() {  //вывод всех тегов
  if (isMoreTags) {
    isMoreTags = false;
    tagsMoreButton.innerHTML = "Показать все теги";
    for (var i = 0; i < moreTagsContainer.length; i++) {
      moreTagsContainer[i].classList.add("visual-hidden");
    }
  } else {
    isMoreTags = true;
    tagsMoreButton.innerHTML = "Скрыть часть тегов";
    if (moreTagsContainer.length > 0) {
      for (var i = 0; i < moreTagsContainer.length; i++) {
        moreTagsContainer[i].classList.remove("visual-hidden");
      }
    } else {
      loadJSON('jsons/tags.json', function(data) {
        for (var i = 5; i < data.length; i++) { 
          writeTag(data[i], i, true);
        }
      });  
    }
  }
}

var writeTag = function(tag, number, isMoreTags) {
  var checkbox = document.createElement("input");
  tagsContainer.appendChild(checkbox);
  checkbox.className = "visual-hidden";
  checkbox.type = "checkbox";
  checkbox.id = "tag" + number;
  
  var label = document.createElement("label");
  tagsContainer.appendChild(label)
  label.className = "tag";
  label.classList.add("tags-container__item");
  label.htmlFor = "tag" + number;
  label.innerHTML = tag;
  
  checkbox.onclick = function() { // выбор тега
    loadJSON('jsons/films.json', function(data) {
      search(data, input.value);
    });
    if (checkbox.checked == true) {
      tagSelect(tag, number, true);
      label.classList.add("tag--active");
    };
    if (checkbox.checked == false) {
      tagSelect(tag, number, false);
      label.classList.remove("tag--active");
    };
  };
  
  if (isMoreTags) {
    moreTagsContainer.push(label); 
  };
}


var tagsSelected = [];
var tagSelect = function(tagName, numberTag, isSelect) {
  if (isSelect) {
    tagsSelected.push(tagName);
  } else {
    for(var i = 0; i < tagsSelected.length; i++) {
      if (tagsSelected[i] == tagName) {
        tagsSelected.splice(i, 1);  
      };
    };
  }
}