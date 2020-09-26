import FilmCardView from '../view/film-card.js';
import FilmDetailsPopupView from '../view/film-popup.js';
import {render, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType, FilterType} from '../const.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`,
};
const MIN_COMMENT_LENGTH = 3;

export default class FilmCardPresenter {
  constructor(filmList, changeData, changeMode) {
    this._filmList = filmList;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;
    this._controlFlag = false;
    this._changedProperties = null;


    // Bind handlers
    this._showPopup = this._showPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
    this._handleCommentSendClick = this._handleCommentSendClick.bind(this);

    this._handleWatchlistPopupClick = this._handleWatchlistPopupClick.bind(this);
    this._handleFavoritePopupClick = this._handleFavoritePopupClick.bind(this);
    this._handleHistoryPopupClick = this._handleHistoryPopupClick.bind(this);
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
    this._popupComponent.setPopupWatchlistClickHandler(this._handleWatchlistPopupClick);
    this._popupComponent.setPopupHistoryClickHandler(this._handleHistoryPopupClick);
    this._popupComponent.setPopupFavoriteClickHandler(this._handleFavoritePopupClick);
    this._popupComponent.setCommentDeleteHandler(this._handleCommentDeleteClick);
    this._popupComponent.setCommentSendHandler(this._handleCommentSendClick);


    if (!prevFilmCardComponent || !prevPopupComponent) {
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

    this._changeMode();
    this._mode = Mode.POPUP;

    document.body.appendChild(this._popupComponent.getElement());
    // Set handler on ESC down
    document.addEventListener(`keydown`, this._onEscKeyDown);

    this._setCurrentProperties(this._card); // Collect pushed buttons
  }

  // Close popup
  _closePopup() {
    this._popupComponent.reset(this._card); // reset comment block

    document.body.removeChild(this._popupComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;

    if (this._controlFlag) {
      this._changeData(
          UserAction.UPDATE_FILM_CARD,
          UpdateType.PATCH_CUSTOM,
          Object.assign(
              {},
              this._card
          ),
          this._changedProperties
      );
    }
    this._controlFlag = false;
    this._changedProperties = null;
  }

  // Close popup on ESC
  _onEscKeyDown(evt) {
    if (evt.keyCode === 27) {
      this._closePopup(evt);
    }
  }

  _handleWatchlistClick() {
    this._setCurrentProperties(this._card);
    this._toggleProperty(FilterType.WATCHLIST);

    this._changeData(
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH_CUSTOM,
        Object.assign(
            {},
            this._card,
            {
              isListed: !this._card.isListed,
            }
        ),
        this._changedProperties
    );
  }

  _handleWatchlistPopupClick() {
    this._changeData(
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._card,
            {
              isListed: !this._card.isListed,
            }
        )
    );
    this._controlFlag = true;
    this._toggleProperty(FilterType.WATCHLIST);
  }

  _handleHistoryClick() {
    this._setCurrentProperties(this._card);
    this._toggleProperty(FilterType.HISTORY);

    this._changeData(
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH_CUSTOM,
        Object.assign(
            {},
            this._card,
            {
              isWatched: !this._card.isWatched,
              watchingDate: new Date()
            }
        ),
        this._changedProperties
    );
  }

  _handleHistoryPopupClick() {
    this._changeData(
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._card,
            {
              isWatched: !this._card.isWatched,
              watchingDate: new Date()
            }
        )
    );
    this._controlFlag = true;
    this._toggleProperty(FilterType.HISTORY);
  }

  _handleFavoriteClick() {
    this._setCurrentProperties(this._card);
    this._toggleProperty(FilterType.FAVORITES);

    this._changeData(
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH_CUSTOM,
        Object.assign(
            {},
            this._card,
            {
              isFavorite: !this._card.isFavorite,
            }
        ),
        this._changedProperties
    );
  }

  _handleFavoritePopupClick() {
    this._changeData(
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._card,
            {
              isFavorite: !this._card.isFavorite,
            }
        )
    );
    this._controlFlag = true;
    this._toggleProperty(FilterType.FAVORITES);
  }

  _handleCommentDeleteClick(element) {
    const commentId = element.dataset.commentId;
    const comments = this._card.comments.slice();
    comments.splice(comments.findIndex((comment) => String(comment.id) === commentId), 1);

    this._changeData(
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._card,
            {
              comments,
            }
        )
    );
  }

  _handleCommentSendClick(newComment) {
    if (!newComment.emoji || newComment.text.length < MIN_COMMENT_LENGTH) {
      return;
    }

    const updatedCommentsArray = Object.assign({}, this._card).comments;
    updatedCommentsArray.push(newComment);

    this._changeData(
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._card,
            {
              comments: updatedCommentsArray
            }
        )
    );
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _toggleProperty(property) {
    if (this._changedProperties[property] === `changed`) {
      this._changedProperties[property] = null;
    } else {
      this._changedProperties[property] = `changed`;
    }
  }

  _setCurrentProperties() {
    this._changedProperties = {
      favorites: null,
      history: null,
      watchlist: null,
      all: null
    };
  }
}
