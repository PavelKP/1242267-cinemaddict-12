import AbstractView from './abstract.js';
import {SortType} from '../const.js';

const createFilmSortingTemplate = () => {
  return (
    `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
  );
};

export default class FilmSorting extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._currentSortElement = null;
  }

  _getTemplate() {
    return createFilmSortingTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();
    this._refreshActiveSortingClass(evt);
    this._callback.sortTypeChangeHandler(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChangeHandler = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);

    // Set current sorting control
    this._currentSortElement = this._element.querySelector(`.sort__button--active`);
  }

  _refreshActiveSortingClass(evt) {
    this._currentSortElement.classList.remove(`sort__button--active`);
    this._currentSortElement = evt.target;
    this._currentSortElement.classList.add(`sort__button--active`);
  }
}
