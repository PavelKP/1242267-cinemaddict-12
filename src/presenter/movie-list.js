import FilmCardPresenter, {State as CardPresenterViewState} from '../presenter/film-card.js';
import FilmBoardView from '../view/film-board.js';
import LoadMoreButtonView from '../view/load-more-button.js';
import NoFilmsView from '../view/no-films.js';
import FilmSortingView from '../view/film-sorting.js';
import LoadingView from '../view/loading.js';
import {render, remove, replace} from '../utils/render.js';
import {SortType, UserAction, UpdateType, FILM_CARD_AMOUNT_PER_STEP, PROPERTY_STATUS_CHANGED} from '../const.js';
import {sortByDate, sortByRating} from '../utils/film-cards.js';
import {filter} from '../utils/filters.js';

export default class MovieList {
  constructor(boardContainer, filmCardsModel, filterModel, api) {
    this._filmCardsModel = filmCardsModel;
    this._boardContainer = boardContainer;
    this._filterModel = filterModel;

    this._currentSortType = SortType.DEFAULT;
    this._renderedFilmCards = FILM_CARD_AMOUNT_PER_STEP;
    this._filmCardPresenterObserver = {};
    this._isLoading = true;
    this._api = api;

    this._filmSortingComponent = null;
    this._loadMoreButtonComponent = null;
    this._filmListElement = null;
    this.destroyed = false;
    this._cardPropertyChanged = false;

    this._filmBoardComponent = new FilmBoardView();
    this._noFilmsComponent = new NoFilmsView();
    this._loadingComponent = new LoadingView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    // Data binding handlers
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    this.destroyed = false;

    // When something happens with model, it will invoke callback
    this._filmCardsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  _getFilmCards() {
    let filterType = this._filterModel.get();
    filterType = (filterType === `stats`) ? `all` : filterType;

    const filmCards = this._filmCardsModel.getFilmCards();

    const filteredCards = filter[filterType](filmCards);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredCards.sort(sortByDate);
      case SortType.RATING:
        return filteredCards.sort(sortByRating);
    }

    return filteredCards;
  }

  // Render one card
  _renderCard(container, card) {
    const filmCardPresenter = new FilmCardPresenter(container, this._handleViewAction, this._handleModeChange);
    filmCardPresenter.init(card);
    this._filmCardPresenterObserver[card.id] = filmCardPresenter;
  }

  // Render number of cards from array
  _renderCards(filmCards) {
    filmCards.forEach((card) => this._renderCard(this._filmListElement, card));
  }

  // Render cards and button if necessary
  _renderCardsList(incomeCards) {
    const filmCardsCount = this._getFilmCards().length;

    const filmCards = incomeCards ? incomeCards
      : this._getFilmCards()
        .slice(0, Math.min(filmCardsCount, FILM_CARD_AMOUNT_PER_STEP));

    this._renderCards(filmCards);

    if (filmCardsCount > this._renderedFilmCards) {
      this._renderLoadMoreButton();
    }
  }

  // Render load more button
  _renderLoadMoreButton() {
    if (this._loadMoreButtonComponent) {
      this._loadMoreButtonComponent = null;
    }

    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._loadMoreButtonComponent.setHandler((evt) => {
      evt.preventDefault();
      this._handleLoadMoreButtonClick();
    });

    render(this._filmListElement.parentElement, this._loadMoreButtonComponent, `beforeend`);
  }

  _renderNoFilms() {
    render(this._filmListElement, this._noFilmsComponent, `beforeend`);
  }

  _renderLoading() {
    render(this._filmListElement, this._loadingComponent, `beforeend`);
  }

  _renderSort() {
    const prevSortingComponent = this._filmSortingComponent;

    this._filmSortingComponent = new FilmSortingView(this._currentSortType);
    this._filmSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    if (prevSortingComponent) {
      replace(this._filmSortingComponent, prevSortingComponent);
      remove(prevSortingComponent);
    } else {
      render(this._boardContainer, this._filmSortingComponent, `beforeend`); // Render sorting block
    }
  }

  destroySort() {
    if (this._filmSortingComponent) {
      remove(this._filmSortingComponent);
      this._filmSortingComponent = null;
    }
  }

  _clearFilmList() {
    Object
      .values(this._filmCardPresenterObserver)
      .forEach((presenter) => presenter.destroy());
    this._filmCardPresenterObserver = {};
    this._renderedFilmCards = FILM_CARD_AMOUNT_PER_STEP;
  }

  _prepareEmptyBoard() {
    // Render empty board
    // Define empty film card container
    render(this._boardContainer, this._filmBoardComponent, `beforeend`);
    this._filmListElement = this._filmBoardComponent.getElement().querySelector(`.films-list .films-list__container`);
  }

  _renderBoard() {
    const filmCards = this._getFilmCards();
    const filmCardsCount = filmCards.length;

    if (this._isLoading) {
      this._prepareEmptyBoard();
      this._renderLoading();
      return;
    }

    if (filmCardsCount === 0) {
      this._prepareEmptyBoard();
      this._renderNoFilms(); // Render plug
      return;
    }
    this._renderSort(); // Render sorting block
    this._prepareEmptyBoard();

    this._renderCardsList(filmCards.slice(0, Math.min(filmCardsCount, this._renderedFilmCards))); // Render cards + button
  }

  _clearBoard({resetRenderedFilmCardsCount = false, resetSortType = false} = {}) {

    Object
      .values(this._filmCardPresenterObserver)
      .forEach((presenter) => presenter.destroy());
    this._filmCardPresenterObserver = {};

    remove(this._filmBoardComponent);
    remove(this._noFilmsComponent);
    remove(this._loadingComponent);

    if (this._loadMoreButtonComponent) {
      remove(this._loadMoreButtonComponent);
    }

    if (resetRenderedFilmCardsCount) {
      this._renderedFilmCards = FILM_CARD_AMOUNT_PER_STEP;
    } else {
      const filmCardsCount = this._getFilmCards().length;
      this._renderedFilmCards = Math.min(filmCardsCount, this._renderedFilmCards);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  destroy() {
    this._clearBoard({resetRenderedFilmCardsCount: true, resetSortType: true});

    this._filmCardsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this.destroyed = true;
  }

  _handleLoadMoreButtonClick() {
    const filmCardsCount = this._getFilmCards().length;
    const newRenderedFilmCardsCount = Math.min(filmCardsCount, this._renderedFilmCards + FILM_CARD_AMOUNT_PER_STEP);
    const filmCards = this._getFilmCards().slice(this._renderedFilmCards, newRenderedFilmCardsCount);

    this._renderCards(filmCards);
    this._renderedFilmCards += FILM_CARD_AMOUNT_PER_STEP; // Rendered cards + rendered after click

    // Remove button if nothing to render
    if (this._renderedFilmCards >= filmCardsCount) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;

    this._clearFilmList();
    remove(this._loadMoreButtonComponent);
    this._renderCardsList();
  }

  _handleViewAction(actionType, updateType, update, property) {
    const deletedCommentId = update.deletedCommentId;
    const clearId = String(update.id || update.cardId);
    const fallback = this._getFilmCards().filter((card) => card.id === update.id);

    this._cardPropertyChanged = property;

    switch (actionType) {
      case UserAction.UPDATE_FILM_CARD:
        this._api.updateFilmCard(update, ...fallback)
          .then((updatedCard) => {
            this._filmCardsModel.updateFilmCard(updateType, updatedCard);
          });
        break;
      case UserAction.ADD_COMMENT:
        this._filmCardPresenterObserver[clearId].setViewState(CardPresenterViewState.SAVING);
        this._api.addComment(update)
          .then((updatedCard) => {
            this._filmCardsModel.updateFilmCard(updateType, updatedCard);
          })
          .catch(() => {
            this._filmCardPresenterObserver[clearId].setViewState(CardPresenterViewState.ABORTING, deletedCommentId, actionType);
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._filmCardPresenterObserver[clearId].setViewState(CardPresenterViewState.DELETING, deletedCommentId, actionType);
        this._api.deleteComment(update)
        .then(() => {
          this._filmCardsModel.updateFilmCard(updateType, update);
        })
        .catch(() => {
          this._filmCardPresenterObserver[clearId].setViewState(CardPresenterViewState.ABORTING, deletedCommentId, actionType);
        });
        break;
    }
  }

  _handleModelEvent(updateType, update) {

    if (update === `stats`) {
      return;
    }

    switch (updateType) {
      case UpdateType.PATCH:
        // Only update single film card and popup
        this._filmCardPresenterObserver[update.id].init(update);


        break;
      case UpdateType.PATCH_CUSTOM:
        const filterType = this._filterModel.get();
        if (this._cardPropertyChanged[filterType] === PROPERTY_STATUS_CHANGED) {
          // MINOR update
          this._clearBoard();
          this._renderBoard();
        } else {
          // Update single film card, popup, filter
          this._filmCardPresenterObserver[update.id].init(update);
          this._renderSort(); // Render sorting block
          this._cardPropertyChanged = null;
        }
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedFilmCardsCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _handleModeChange() {
    Object
      .values(this._filmCardPresenterObserver)
      .forEach((presenter) => presenter.resetView());
  }
}
