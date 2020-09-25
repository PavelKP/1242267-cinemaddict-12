import FilmCardsModel from './model/movies.js';

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
    this._comments = {};
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
        .then((comments) => { // Save comments in this._comments
          card.comments = comments;
          this._comments[card.id] = comments;

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

  updateFilmCard(card, fallback) {
    return this._load({
      url: `movies/${card.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmCardsModel.adaptCardToServer(card)),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then(Api.toJSON)
    .then(FilmCardsModel.adaptToClient)
    .then((adaptedCard) => {
      const oldComments = this._comments[card.id].slice();
      const flags = card.comments.map((comment) => {
        let flag;
        for (const oldComment of oldComments) {
          if (oldComment.id === comment.id) {
            flag = true;
            break;
          }
          flag = false;

        }
        return flag;
      });
      // If new comments don`t exist
      // We don't ask sever for
      if (flags.indexOf(false) === -1) {
        return (
          Promise.resolve(oldComments)
            .then((comments) => {
              adaptedCard.comments = comments;
              return Promise.resolve(adaptedCard);
            })
        );
      } else {
        return (
          this._getComments(adaptedCard.id)
            .then((comments) => {
              adaptedCard.comments = comments;
              return Promise.resolve(adaptedCard);
            })
        );
      }

    })
    .catch((err) => {
      window.console.error(err);
      return Promise.resolve(fallback);
    });
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
