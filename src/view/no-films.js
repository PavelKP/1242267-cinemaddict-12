import AbstractView from './abstract.js';

const createNoFilmsTemplate = () => {
  return (
    `<h2 class="films-list__title">There are no movies in our database</h2>`
  );
};

export default class NoFilms extends AbstractView {
  _getTemplate() {
    return createNoFilmsTemplate();
  }
}
