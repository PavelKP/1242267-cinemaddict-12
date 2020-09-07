import AbstractView from './abstract.js';

const createFilmNumberTemplate = (filmCards) => {
  const filmsTotal = filmCards.length;

  return (
    `<p>${filmsTotal} movies inside</p>`
  );
};

export default class FilmNumber extends AbstractView {
  constructor(filmCards) {
    super();
    this._filmCards = filmCards;
  }

  _getTemplate() {
    return createFilmNumberTemplate(this._filmCards);
  }
}
