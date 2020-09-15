import Observer from '../utils/observer.js';

export default class Movies extends Observer {
  constructor() {
    super();
    this._filmCards = [];
  }

  setFilmCards(filmCards) {
    this._filmCards = filmCards.slice();
  }

  getFilmCards() {
    return this._filmCards;
  }
}
