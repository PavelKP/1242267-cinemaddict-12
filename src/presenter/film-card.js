import FilmCardView from '../view/film-card.js';
import FilmDetailsPopupView from '../view/film-popup.js';
import {render} from '../utils/render.js';

export default class FilmCardPresenter {
  constructor(filmList) {
    this._filmList = filmList;

    this._filmCardComponent = null;
    this._popupComponent = null;

    // Bind handlers
    this._showPopup = this._showPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(card) {
    this._filmCardComponent = new FilmCardView(card);
    this._popupComponent = new FilmDetailsPopupView(card);

    render(this._filmList, this._filmCardComponent, `beforeend`);

    this._filmCardComponent.setPosterClickHandler(this._showPopup);
    this._filmCardComponent.setTitleClickHandler(this._showPopup);
    this._filmCardComponent.setCommentsClickHandler(this._showPopup);
    this._popupComponent.setPopupCloseButtonHandler(this._closePopup);
  }

  _showPopup(evt) {
    evt.preventDefault();
    document.body.appendChild(this._popupComponent.getElement());
    // Set handler on ESC down
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  // Close popup
  _closePopup(evt) {
    evt.preventDefault();
    document.body.removeChild(this._popupComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  // Close popup on ESC
  _onEscKeyDown(evt) {
    if (evt.keyCode === 27) {
      this._closePopup(evt);
    }
  }
}
