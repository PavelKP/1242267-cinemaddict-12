import {createElement} from '../utils.js';

const createFilmNumberTemplate = (filmCards) => {
  const filmsTotal = filmCards.length;

  return (
    `<p>${filmsTotal} movies inside</p>`
  );
};

export default class FilmNumber {
  constructor(filmCards) {
    this._filmCards = filmCards;
    this._element = null;
  }

  _getTemplate() {
    return createFilmNumberTemplate(this._filmCards);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
