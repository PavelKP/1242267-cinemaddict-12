import FilmCardView from '../view/film-card.js';
import FilmDetailsPopupView from '../view/film-popup.js';
import {render, replace, remove} from '../utils/render.js';

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
    const prevFilmCardComponent = this._filmCardComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmCardComponent = new FilmCardView(card);
    this._popupComponent = new FilmDetailsPopupView(card);

    // Set handlers
    this._filmCardComponent.setPosterClickHandler(this._showPopup);
    this._filmCardComponent.setTitleClickHandler(this._showPopup);
    this._filmCardComponent.setCommentsClickHandler(this._showPopup);
    this._popupComponent.setPopupCloseButtonHandler(this._closePopup);

    if (prevFilmCardComponent === null || prevPopupComponent === null) {
      render(this._filmList, this._filmCardComponent, `beforeend`);
      return;
    }
    // if previous film card exists in DOM, change it to new card
    if (this._filmList.contains(prevFilmCardComponent.getElement())) {
      // We need new component with handlers (I use getElement() instead of this.element in View)
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    // if previous popup exists in DOM, change it to new popup
    if (document.body.contains(prevPopupComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevPopupComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._popupComponent);
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
