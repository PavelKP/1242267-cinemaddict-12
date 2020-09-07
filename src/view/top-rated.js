import {createElement} from '../utils.js';

const createTopRatedTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container"></div>

    </section>`
  );
};

export default class TopRatedBlock {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createTopRatedTemplate();
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
