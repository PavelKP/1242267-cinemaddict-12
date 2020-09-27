import Observer from '../utils/observer.js';
import {FilterType} from '../const.js';


export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
    this._renderedFilmCards = null;
  }

  set(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  get() {
    return this._activeFilter;
  }
}
