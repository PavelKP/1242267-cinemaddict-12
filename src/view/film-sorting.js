import AbstractView from './abstract.js';
import {SortType} from '../const.js';

const createFilmSortingTemplate = (currentSortType) => {
  const sortingList = Object.values(SortType).map((type) => {
    const activeClass = (type === currentSortType) ? `sort__button--active` : ``;
    return (`
    <li><a href="#" class="sort__button ${activeClass}" data-sort-type="${type}">Sort by ${type}</a></li>
    `);
  }).join(``);

  return (
    `<ul class="sort">
    ${sortingList}
    </ul>`
  );
};

export default class FilmSorting extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._currentSortElement = null;
  }

  _getTemplate() {
    return createFilmSortingTemplate(this._currentSortType);
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

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();
    this._refreshActiveSortingClass(evt);
    this._callback.sortTypeChangeHandler(evt.target.dataset.sortType);
  }
}
