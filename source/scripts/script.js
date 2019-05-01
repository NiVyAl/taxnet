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

var filmsContainer = document.querySelector(".films-container");
var k = 0;

var parse = function(data) {
  for (var i = 0; i < 5; i++) {
    var film = document.createElement("div");
    filmsContainer.appendChild(film);
    film.className = "films-container__item film";
    film.innerHTML = "<p class='film__text'></p><button class='film__favourite-button favourite-button'></button>";
  }
  
  var filmText = document.querySelectorAll(".film__text");
  
  for (var i = k; i < k+5; i++) {
    console.log(data[i]);
    filmText[i].innerHTML = data[i].title;
  };
  k = i
}

loadJSON('jsons/films.json', function(data) {
    parse(data);
  }
);

var buttonMore = document.querySelector(".button-more");
buttonMore.onclick = function(){
  loadJSON('jsons/films.json', function(data) {
    parse(data);
  }
  );
};