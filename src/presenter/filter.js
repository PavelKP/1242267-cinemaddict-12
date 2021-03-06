import FilterView from '../view/site-menu.js';
import {render, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filters.js';
import {FilterType, UpdateType} from '../const.js';

export default class Filter {
  constructor(container, model, filmCardsModel, handleStatisticClick, handleMenuItemClick) {
    this._container = container;
    this._model = model;
    this._filmCardsModel = filmCardsModel;
    this._currentValue = null;
    this._isOpen = false;

    this._view = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleTypeChange = this._handleTypeChange.bind(this);

    this._handleStatisticClick = handleStatisticClick.bind(this);
    this._handleMenuItemClick = handleMenuItemClick.bind(this);

    this._filmCardsModel.addObserver(this._handleModelEvent);
    this._model.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentValue = this._model.get();

    const filters = this._getValues();
    const prevComponent = this._view;

    this._view = new FilterView(filters, this._currentValue);

    if (this._isOpen) {
      this._view.setFilterTypeClickHandler(this._handleTypeChange);
      this._view.setStatisticClickHandler(this._handleStatisticClick);
      this._view.setMenuItemClickHandler(this._handleMenuItemClick);
    }

    if (!prevComponent) {
      render(this._container, this._view, `beforeend`);
      return;
    }

    replace(this._view, prevComponent);
    remove(prevComponent);
  }

  unlock() {
    this._isOpen = true;
    this.init();
  }

  _handleModelEvent() {
    this._isOpen = true;
    this.init();
  }

  _handleTypeChange(filterType) {
    if (this._currentValue === filterType) {
      return;
    }

    this._model.set(UpdateType.MAJOR, filterType);
  }

  _getValues() {
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
