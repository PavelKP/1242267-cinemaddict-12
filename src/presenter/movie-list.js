import FilmCardPresenter, {State as CardPresenterViewState} from '../presenter/film-card.js';
import FilmBoardView from '../view/film-board.js';
import LoadMoreButtonView from '../view/load-more-button.js';
import TopRatedView from '../view/top-rated.js';
import MostCommentedView from '../view/most-commented.js';
import NoFilmsView from '../view/no-films.js';
import FilmSortingView from '../view/film-sorting.js';
import LoadingView from '../view/loading.js';
import {render, remove, replace} from '../utils/render.js';
import {SortType, UserAction, UpdateType, FILM_CARD_AMOUNT_PER_STEP, PROPERTY_STATUS_CHANGED} from '../const.js';
import {sortByDate, sortByRating} from '../utils/film-cards.js';
import {filter} from '../utils/filters.js';

// Constants
const EXTRA_FILM_CARD_AMOUNT = 2;
const IdType = {
  TOP_RATED: `topRated`,
  MOST_COMMENTED: `mostCommented`,
};

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
    this._topRatedComponent = new TopRatedView();
    this._mostCommentedComponent = new MostCommentedView();
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
  _renderCard(container, card, modifier = ``) {
    const filmCardPresenter = new FilmCardPresenter(container, this._handleViewAction, this._handleModeChange);
    filmCardPresenter.init(card);
    this._filmCardPresenterObserver[modifier + card.id] = filmCardPresenter;
  }

  // Render number of cards from array
  _renderCards(filmCards) {
    for (let i = 0; i < filmCards.length; i++) {
      this._renderCard(this._filmListElement, filmCards[i]);
    }
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

  _renderExtraFilmCards(component, idType) {
    let cards = this._filmCardsModel.getFilmCards(); // All cards, not filtered
    switch (idType) {
      case IdType.TOP_RATED:
        cards = cards.slice().sort((a, b) => b.rating - a.rating);
        break;
      case IdType.MOST_COMMENTED:
        cards = cards.slice().sort((a, b) => b.comments.length - a.comments.length);
    }

    render(this._filmBoardComponent, component, `beforeend`); // Render extra block
    const extraContainerElement = component.getElement().querySelector(`.films-list__container`);
    const cardAmount = Math.min(cards.length, EXTRA_FILM_CARD_AMOUNT);

    cards.slice(0, cardAmount).forEach((card) => this._renderCard(extraContainerElement, card, idType));
  }

  _renderNoFilms() {
    render(this._filmListElement, this._noFilmsComponent, `beforeend`);
  }

  _renderLoading() {
    render(this._filmListElement, this._loadingComponent, `beforeend`);
  }

  _runInitByProperty(key, updatedFilmCard) {
    if (this._filmCardPresenterObserver.hasOwnProperty((key))) {
      this._filmCardPresenterObserver[key].init(updatedFilmCard);
    }
  }

  _changeViewStateByProperty(update, state, clearId, actionType) {
    const prefixes = [``, IdType.TOP_RATED, IdType.MOST_COMMENTED];

    prefixes.forEach((prefix) => {
      if (this._filmCardPresenterObserver.hasOwnProperty([prefix + clearId])) {
        this._filmCardPresenterObserver[prefix + clearId].setViewState(state, update.deletedCommentId, actionType);
      }
    });
  }

  _updateSingleCardAndPopup(filmCard) {
    const clearId = String(filmCard.id).match(/(\d+)$/g);
    this._runInitByProperty(clearId, filmCard);
    this._runInitByProperty(IdType.TOP_RATED + clearId, filmCard);
    this._runInitByProperty(IdType.MOST_COMMENTED + clearId, filmCard);
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
    // Render extra cards
    this._renderExtraFilmCards(this._topRatedComponent, IdType.TOP_RATED);
    this._renderExtraFilmCards(this._mostCommentedComponent, IdType.MOST_COMMENTED);
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

    remove(this._topRatedComponent);
    remove(this._mostCommentedComponent);

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

  _refreshMostCommented() {
    // Refresh most commented block
    remove(this._mostCommentedComponent);
    this._renderExtraFilmCards(this._mostCommentedComponent, IdType.MOST_COMMENTED);
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
    this._renderExtraFilmCards(this._topRatedComponent, IdType.TOP_RATED);
    this._renderExtraFilmCards(this._mostCommentedComponent, IdType.MOST_COMMENTED);
  }

  _handleViewAction(actionType, updateType, update, property) {
    const fallback = this._getFilmCards().filter((card) => card.id === update.id);
    this._cardPropertyChanged = property;
    const clearId = String(update.id || update.cardId).match(/(\d+)$/g);

    switch (actionType) {
      case UserAction.UPDATE_FILM_CARD:
        this._api.updateFilmCard(update, ...fallback)
          .then((updatedCard) => {
            this._filmCardsModel.updateFilmCard(updateType, updatedCard);
          });
        break;
      case UserAction.ADD_COMMENT:
        this._changeViewStateByProperty(update, CardPresenterViewState.SAVING, clearId, actionType);
        this._api.addComment(update)
          .then((updatedCard) => {
            this._filmCardsModel.updateFilmCard(updateType, updatedCard);

            this._refreshMostCommented(); // Refresh most commented block
          })
          .catch(() => {
            this._changeViewStateByProperty(update, CardPresenterViewState.ABORTING, clearId, actionType);
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._changeViewStateByProperty(update, CardPresenterViewState.DELETING, clearId, actionType);
        this._api.deleteComment(update)
        .then(() => {
          this._filmCardsModel.updateFilmCard(updateType, update);

          this._refreshMostCommented(); // Refresh most commented block
        })
        .catch(() => {
          this._changeViewStateByProperty(update, CardPresenterViewState.ABORTING, clearId, actionType);
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
        this._updateSingleCardAndPopup(update);
        break;
      case UpdateType.PATCH_CUSTOM:
        const filterType = this._filterModel.get();
        if (this._cardPropertyChanged[filterType] === PROPERTY_STATUS_CHANGED) {
          // MINOR update
          this._clearBoard();
          this._renderBoard();
        } else {
          // Update single film card, popup, filter
          this._updateSingleCardAndPopup(update);

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
