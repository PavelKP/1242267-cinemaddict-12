import AbstractView from './abstract.js';

const createLoadMoreButtonTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class LoadMoreButton extends AbstractView {
  constructor() {
    super();
    this._loadMoreButtonHandler = this._loadMoreButtonHandler.bind(this);
  }

  _getTemplate() {
    return createLoadMoreButtonTemplate();
  }

  _loadMoreButtonHandler(evt) {
    this._callback.loadMoreButtonHandler(evt);
  }

  setLoadMoreButtonHandler(callback) {
    this._callback.loadMoreButtonHandler = callback;
    this._element.addEventListener(`click`, this._loadMoreButtonHandler);
  }
}
