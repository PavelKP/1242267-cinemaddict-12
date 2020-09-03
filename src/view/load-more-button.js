import {createElement} from '../utils.js';

const createLoadMoreButtonTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class LoadMoreButton {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createLoadMoreButtonTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
