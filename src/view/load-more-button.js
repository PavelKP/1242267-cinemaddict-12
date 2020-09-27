import AbstractView from './abstract.js';

const createLoadMoreButtonTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class LoadMoreButton extends AbstractView {
  constructor() {
    super();
    this._controlHandler = this._controlHandler.bind(this);
  }

  _getTemplate() {
    return createLoadMoreButtonTemplate();
  }

  _controlHandler(evt) {
    this._callback.controlHandler(evt);
  }

  setHandler(callback) {
    this._callback.controlHandler = callback;
    this.getElement().addEventListener(`click`, this._controlHandler);
  }
}
