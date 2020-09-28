import FilmCardsModel from './model/movies.js';

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
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
    .then((comments) => FilmCardsModel.adaptCommentsToClient(comments));
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
      const flags = card.comments.map((newComment) =>
        oldComments.findIndex((oldComment) => oldComment.id === newComment.id)
      );

      // If new comments exist
      // We ask server for
      if (flags.includes(-1)) {
        return (
          this._getComments(adaptedCard.id)
            .then((comments) => {
              adaptedCard.comments = comments;
              return Promise.resolve(adaptedCard);
            })
        );
      } else {
        return (
          Promise.resolve(oldComments)
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


  addComment(comment) {
    const cardId = comment.cardId;
    delete comment.cardId;

    return this._load({
      url: `comments/${cardId}`,
      method: Method.POST,
      body: JSON.stringify(FilmCardsModel.adaptLocalCommentToServer(comment)),
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
      .catch((err) => {
        window.console.error(err);
      });
  }

  deleteComment(card) {
    const deletedCommentId = card.deletedCommentId;
    delete card.deletedCommentId;

    return this._load({
      url: `comments/${deletedCommentId}`,
      method: Method.DELETE
    });
  }

  static toJSON(response) {
    return response.json();
  }

  static checkStatus(response) {
    if (response.status < SuccessHTTPStatusRange.MIN
      || response.status > SuccessHTTPStatusRange.MAX) {

      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  }

  static catchError(err) {
    throw err;
  }
}
