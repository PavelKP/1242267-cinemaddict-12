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

    this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
  }

  _getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilter);
  }

  _filterTypeClickHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeClick(evt.target.dataset.filterType);
  }

  setFilterTypeClickHandler(callback) {
    this._callback.filterTypeClick = callback;
    this.getElement().addEventListener(`click`, this._filterTypeClickHandler);
  }
}


