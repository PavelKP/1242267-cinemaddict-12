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
      promises.push(this._getComments(card.id)
        .then((comments) => {
          card.comments = comments;

          return card;
        }));
    });

    return Promise.all(promises);
  }

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
      body: JSON.stringify(FilmCardsModel.adaptCardToServer(card)),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then(Api.toJSON)
    .then(FilmCardsModel.adaptToClient)
    .then((adaptedCard) => {
      return (
        this._getComments(adaptedCard.id)
          .then((comments) => {
            adaptedCard.comments = comments;
            return Promise.resolve(adaptedCard);
          })
      );
    })
    .catch((err) => window.console.log(err));
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
