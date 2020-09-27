import AbstractView from './abstract.js';

// Create one filter template
const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  // Cards amount shows for filters except "all" filter name
  // Not more than 5 cards
  const number = (type !== `all`)
    ? `<span class="main-navigation__item-count">${count}</span>`
    : ``;

  // Active style for filter
  const activeFilterClassName = (type === currentFilterType)
    ? `main-navigation__item--active`
    : ``;

  return (`
    <a href="#${type}" data-filter-type="${type}" class="main-navigation__item ${activeFilterClassName}">${name} ${number}</a>
  `);
};

const createSiteMenuTemplate = (filters, currentFilterType) => {
  // Generate filters
  // First array element (filter) has active class forever
  const filterItemsTemplate = filters.map((element) => createFilterItemTemplate(element, currentFilterType)).join(``);

  // Active style for stats
  const activeFilterClassName = (currentFilterType === `stats`)
    ? `main-navigation__item--active`
    : ``;

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
      <a href="#stats" data-filter-type="stats" class="main-navigation__additional ${activeFilterClassName}">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
  }

  _getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilter);
  }

  setFilterTypeClickHandler(callback) {
    this._callback.filterTypeClick = callback;
    this.getElement().addEventListener(`click`, this._filterTypeClickHandler);
  }

  setStatisticClickHandler(callback) {
    this._callback.statisticClick = callback;
  }

  setMenuItemClickHandler(callback) {
    this._callback.menuItemClick = callback;
  }

  _filterTypeClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    if (evt.target.dataset.filterType !== `stats`) {
      this._callback.menuItemClick();
      this._callback.filterTypeClick(evt.target.dataset.filterType);
    } else {
      this._callback.filterTypeClick(evt.target.dataset.filterType);
      this._callback.statisticClick();
    }
  }
}


