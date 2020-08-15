import {FILTER_NUMBER_LIMIT} from '../const.js';

const filterNameToTitleMap = {
  all: `All movies`,
  watchlist: `Watchlist`,
  history: `History`,
  favorites: `Favorites`,
};

// Create one filter template
const createFilterItemTemplate = (filter, isActive) => {
  const {filterName, cardsAmount} = filter;

  // Cards amount shows for filters except "all" filter name
  // Not more than 5 cards
  const number = (filterName !== `all` && cardsAmount <= FILTER_NUMBER_LIMIT)
    ? `<span class="main-navigation__item-count">${cardsAmount}</span>`
    : ``;

  // Active style for filter
  const activeFilterClassName = isActive
    ? `main-navigation__item--active`
    : ``;

  return (`
    <a href="#${filterName}" class="main-navigation__item ${activeFilterClassName}">${filterNameToTitleMap[filterName]} ${number}</a>
  `);
};

export const createSiteMenuTemplate = (filters) => {
  // Generate filters
  // First array element (filter) has active class forever
  const filterItemsTemplate = filters.map((element, i) => createFilterItemTemplate(element, i === 0)).join(``);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};
