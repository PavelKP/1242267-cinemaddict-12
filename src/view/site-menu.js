import {FILTER_NUMBER_LIMIT} from '../const.js';
import AbstractView from './abstract.js';

const filterNameToTitleMap = {
  all: `All movies`,
  watchlist: `Watchlist`,
  history: `History`,
  favorites: `Favorites`,
};

// Create one filter template
const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, filterName, cardsAmount} = filter;

  // Cards amount shows for filters except "all" filter name
  // Not more than 5 cards
  const number = (filterName !== `all` && cardsAmount <= FILTER_NUMBER_LIMIT)
    ? `<span class="main-navigation__item-count">${cardsAmount}</span>`
    : ``;

  // Active style for filter
  const activeFilterClassName = (type === currentFilterType)
    ? `main-navigation__item--active`
    : ``;

  return (`
    <a href="#${filterName}" class="main-navigation__item ${activeFilterClassName}">${filterNameToTitleMap[filterName]} ${number}</a>
  `);
};

const createSiteMenuTemplate = (filters, currentFilterType) => {
  // Generate filters
  // First array element (filter) has active class forever
  const filterItemsTemplate = filters.map((element) => createFilterItemTemplate(element, currentFilterType)).join(``);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  _getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilter);
  }

  _filterTypeClickHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeClick(evt.target);
  }

  setFilterTypeClickHandler(callback) {
    this._callback.filterTypeClick = callback;
    this.getElement().addEventListener(`click`, this._filterTypeClickHandler);
  }
}


