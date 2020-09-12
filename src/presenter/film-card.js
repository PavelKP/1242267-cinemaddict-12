import FilmCardView from '../view/film-card.js';
import FilmDetailsPopupView from '../view/film-popup.js';
import {render, replace, remove} from '../utils/render.js';

export default class FilmCardPresenter {
  constructor(filmList, changeData) {
    this._filmList = filmList;
    this._changeData = changeData;

    this._filmCardComponent = null;
    this._popupComponent = null;

    // Bind handlers
    this._showPopup = this._showPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(card) {
    this._card = card;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmCardComponent = new FilmCardView(card);
    this._popupComponent = new FilmDetailsPopupView(card);

    // Set handlers to card
    this._filmCardComponent.setPosterClickHandler(this._showPopup);
    this._filmCardComponent.setTitleClickHandler(this._showPopup);
    this._filmCardComponent.setCommentsClickHandler(this._showPopup);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    // Set handlers to popup
    this._popupComponent.setPopupCloseButtonHandler(this._closePopup);
    this._popupComponent.setPopupWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setPopupHistoryClickHandler(this._handleHistoryClick);
    this._popupComponent.setPopupFavoriteClickHandler(this._handleFavoriteClick);


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

  _handleWatchlistClick() {
    this._changeData(
        Object.assign(
            {},
            this._card,
            {
              isListed: !this._card.isListed,
            }
        )
    );
  }

  _handleHistoryClick() {
    this._changeData(
        Object.assign(
            {},
            this._card,
            {
              isWatched: !this._card.isWatched,
            }
        )
    );
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._card,
            {
              isFavorite: !this._card.isFavorite,
            }
        )
    );
  }
}
