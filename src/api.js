import FilmCardsModel from "./model/movies.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilmCards() {
    return this._load({url: `movies`})
      .then(Api.toJSON)
			.then((cards) => cards.map(FilmCardsModel.adaptToClient));
  }

  _getComments(filmCardId) {
    return this._load({url: `comments/${filmCardId}`})
    .then(Api.toJSON)
    .then((commentsArray) => FilmCardsModel.adaptCommentsToClient(commentsArray));
  }

  pullComments(cards) {
    const promises = [];

    cards.forEach((card) => {
      promises.push(this._getComments(card.id) // пошёл запрос на сервер, пуш пока не выполняется
        .then((comments) => { // .then ждёт резолва промиса выше
          card.comments = comments;

          return card;
        }));
    }); // цикл отработал и отправил n запросов

    return Promise.all(promises); // возвращается промис с массивом, который ещё не заполнен
    // Promise.all не резолвится, ждёт наполнения массива
    // приходят ответы с сервера и пушатся в массив
    // Массив собран
    // Все промисы в массиве выполнены успешно
  }

/*
  pullComments(adaptedCards) {
    debugger;
    const promises = [];
    adaptedCards.slice(0, 1).forEach((card) => this._getComments(card.id) // пошёл запрос на сервер
      .then((commentsArray) => { // этот then не отрабатывает, начинается следующая итерация
        card.comments = commentsArray;
        promises.push(card);

        return card;
      })); // цикл отработал и отправил n запросов

    return Promise.all(promises); // вернулся пустой массив, который был объявлен выше
    // массив пустой и сразу зарезолвился как пустой
    // далее приходит ответ на каждый запрос
    // выполняется код .then((commentsArray)... карточки фильмов пушатся в массив выше
    // Но промис all уже зарезолвился пустым
  }
*/
  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {

    headers.append(`Authorization`, this._authorization);
    return fetch(
        `${this._endPoint}/${url}`,
        {
          method,
          body,
          headers
        }
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  updateFilmCard(card) {
    return this._load({
      url: `movies/${card.id}`,
      method: Method.PUT,
      body: JSON.stringify(card),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then(Api.toJSON);
  }

  static toJSON(response) {
    return response.json();
  }

  static checkStatus(response) {
    // Почему && а не || (или) ????
    if (response.status < SuccessHTTPStatusRange.MIN
      && response.status > SuccessHTTPStatusRange.MAX) {

      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  }

  static catchError(err) {
    throw err;
  }
}
