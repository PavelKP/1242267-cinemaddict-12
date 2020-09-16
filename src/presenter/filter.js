import FilterView from '../view/site-menu.js';
import {render, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filters.js';
import {FilterType, UpdateType, FILM_CARD_AMOUNT_PER_STEP} from '../const.js';

export default class Filter {
  constructor(filterContainer, filterModel, filmCardsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmCardsModel = filmCardsModel;
    this._currentFilter = null;
    this._renderedCardsNumber = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmCardsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init(renderedCardsNumber = null) {
    this._renderedCardsNumber = renderedCardsNumber;
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeClickHandler(this._handleFilterTypeChange);

    if (!prevFilterComponent) {
      render(this._filterContainer, this._filterComponent, `beforeend`);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init(this._renderedCardsNumber);
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }
    this._renderedCardsNumber = null;
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const filmCards = this._filmCardsModel.getFilmCards();
    const filteredCards = filter[this._currentFilter](filmCards);
    const numberCardsToRender = this._renderedCardsNumber ? this._renderedCardsNumber : Math.min(filteredCards.length, FILM_CARD_AMOUNT_PER_STEP);

    const renderedCards = filteredCards.slice(0, numberCardsToRender);


    return [
      {
        type: FilterType.ALL,
        name: `All movies`,
        count: filter[FilterType.ALL](renderedCards).length
      },
      {
        type: FilterType.WATCHLIST,
        name: `Watchlist`,
        count: filter[FilterType.WATCHLIST](renderedCards).length
      },
      {
        type: FilterType.HISTORY,
        name: `History`,
        count: filter[FilterType.HISTORY](renderedCards).length
      },
      {
        type: FilterType.FAVORITES,
        name: `Favorites`,
        count: filter[FilterType.FAVORITES](renderedCards).length
      },
    ];
  }
}
