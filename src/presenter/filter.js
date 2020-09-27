import FilterView from '../view/site-menu.js';
import {render, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filters.js';
import {FilterType, UpdateType} from '../const.js';

export default class Filter {
  constructor(filterContainer, filterModel, filmCardsModel, handleStatisticClick, handleMenuItemClick) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmCardsModel = filmCardsModel;
    this._currentFilter = null;
    this._isOpen = false;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._handleStatisticClick = handleStatisticClick.bind(this);
    this._handleMenuItemClick = handleMenuItemClick.bind(this);

    this._filmCardsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.get();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);

    if (this._isOpen) {
      this._filterComponent.setFilterTypeClickHandler(this._handleFilterTypeChange);
      this._filterComponent.setStatisticClickHandler(this._handleStatisticClick);
      this._filterComponent.setMenuItemClickHandler(this._handleMenuItemClick);
    }

    if (!prevFilterComponent) {
      render(this._filterContainer, this._filterComponent, `beforeend`);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  unlock() {
    this._isOpen = true;
    this.init();
  }

  _handleModelEvent() {
    this._isOpen = true;
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.set(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const filmCards = this._filmCardsModel.getFilmCards();

    return [
      {
        type: FilterType.ALL,
        name: `All movies`,
        count: filter[FilterType.ALL](filmCards).length
      },
      {
        type: FilterType.WATCHLIST,
        name: `Watchlist`,
        count: filter[FilterType.WATCHLIST](filmCards).length
      },
      {
        type: FilterType.HISTORY,
        name: `History`,
        count: filter[FilterType.HISTORY](filmCards).length
      },
      {
        type: FilterType.FAVORITES,
        name: `Favorites`,
        count: filter[FilterType.FAVORITES](filmCards).length
      },
    ];
  }
}
