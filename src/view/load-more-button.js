import AbstractView from './abstract.js';

const createLoadMoreButtonTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class LoadMoreButton extends AbstractView {
  _getTemplate() {
    return createLoadMoreButtonTemplate();
  }
}
