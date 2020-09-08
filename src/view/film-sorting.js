import AbstractView from './abstract.js';

const createFilmSortingTemplate = () => {
  return (
    `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`
  );
};

export default class FilmSorting extends AbstractView {
  constructor() {
    super();
  }

  _getTemplate() {
    return createFilmSortingTemplate();
  }
}
