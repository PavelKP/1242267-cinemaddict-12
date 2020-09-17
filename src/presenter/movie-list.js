import FilmBoardView from '../view/film-board.js';
import FilmCardPresenter from '../presenter/film-card.js';
import LoadMoreButtonView from '../view/load-more-button.js';
import TopRatedView from '../view/top-rated.js';
import MostCommentedView from '../view/most-commented.js';
import NoFilmsView from '../view/no-films.js';
import FilmSortingView from '../view/film-sorting.js';
import {render, remove} from '../utils/render.js';
import {SortType, UserAction, UpdateType, FILM_CARD_AMOUNT_PER_STEP} from '../const.js';
import {sortByDate, sortByRating} from '../utils/film-cards.js';
import {filter} from '../utils/filters.js';


// Constants
const TOP_FILM_CARD_AMOUNT = 2;
const COMMENTED_FILM_CARD_AMOUNT = 2;
const IdType = {
  TOP_RATED: `topRated`,
  MOST_COMMENTED: `mostCommented`,
};

export default class MovieList {
  constructor(boardContainer, filmCardsModel, filterModel) {
    this._filmCardsModel = filmCardsModel;
    this._boardContainer = boardContainer;
    this._filterModel = filterModel;

    this._currentSortType = SortType.DEFAULT;
    this._renderedFilmCards = FILM_CARD_AMOUNT_PER_STEP;
    this._filmCardPresenterObserver = {};

    this._filmSortingComponent = null;
    this._loadMoreButtonComponent = null;
    this._filmList = null;

    this._filmBoardComponent = new FilmBoardView();
    this._topRatedComponent = new TopRatedView();
    this._mostCommentedComponent = new MostCommentedView();
    this._noFilmsComponent = new NoFilmsView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    // Data binding handlers
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    // When something happens with model, it will invoke callback
    this._filmCardsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderBoard();
  }

  _getFilmCards() {
    const filterType = this._filterModel.getFilter();
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
      this._renderCard(this._filmList, filmCards[i]);
    }
  }

  // Render cards and button if necessary
  _renderCardsList(incomeCardsArray) {
    const filmCardsCount = this._getFilmCards().length;

    const filmCards = incomeCardsArray ? incomeCardsArray
      : this._getFilmCards()
        .slice(0, Math.min(filmCardsCount, FILM_CARD_AMOUNT_PER_STEP));

    this._renderCards(filmCards);

    if (filmCardsCount > this._renderedFilmCards) {
      this._renderLoadMoreButton();
    }
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

  // Render load more button
  _renderLoadMoreButton() {
    if (this._loadMoreButtonComponent) {
      this._loadMoreButtonComponent = null;
    }

    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._loadMoreButtonComponent.setLoadMoreButtonHandler((evt) => {
      evt.preventDefault();
      this._handleLoadMoreButtonClick();
    });

    render(this._filmList.parentElement, this._loadMoreButtonComponent, `beforeend`);
  }

  _renderExtraFilmCards() {
    render(this._filmBoardComponent, this._topRatedComponent, `beforeend`); // Render top rated block
    render(this._filmBoardComponent, this._mostCommentedComponent, `beforeend`); // Render most commented block

    // Copy film cards array and sort by rating
    // Render top rated films
    const filmCardsOrderByRating = this._getFilmCards().slice().sort((a, b) => b.rating - a.rating);
    const topRatedContainer = this._topRatedComponent.getElement().querySelector(`.films-list__container`);
    for (let i = 0; i < Math.min(filmCardsOrderByRating.length, TOP_FILM_CARD_AMOUNT); i++) {
      this._renderCard(topRatedContainer, filmCardsOrderByRating[i], IdType.TOP_RATED);
    }

    // Copy film cards array and sort by comments amount
    // Render most commented films
    const filmCardsOrderByComments = this._getFilmCards().slice().sort((a, b) => b.comments.length - a.comments.length);
    const mostCommentedContainer = this._mostCommentedComponent.getElement().querySelector(`.films-list__container`);
    for (let i = 0; i < Math.min(filmCardsOrderByRating.length, COMMENTED_FILM_CARD_AMOUNT); i++) {
      this._renderCard(mostCommentedContainer, filmCardsOrderByComments[i], IdType.MOST_COMMENTED);
    }
  }

  _renderNoFilms() {
    render(this._filmList, this._noFilmsComponent, `beforeend`);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;

    this._clearFilmList();
    remove(this._loadMoreButtonComponent);
    this._renderCardsList();
    this._renderExtraFilmCards();
  }

  _runInitByProperty(key, updatedFilmCard) {
    if (this._filmCardPresenterObserver.hasOwnProperty((key))) {
      this._filmCardPresenterObserver[key].init(updatedFilmCard);
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM_CARD:
        this._filmCardsModel.updateFilmCard(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._filmCardsModel.deleteComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // Only update single film card and popup
        const clearId = String(data.id).match(/(\d+)$/g);
        this._runInitByProperty(clearId, data);
        this._runInitByProperty(IdType.TOP_RATED + clearId, data);
        this._runInitByProperty(IdType.MOST_COMMENTED + clearId, data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedFilmCardsCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _renderSort() {
    if (this._filmSortingComponent) {
      this._filmSortingComponent = null;
    }

    this._filmSortingComponent = new FilmSortingView(this._currentSortType);
    this._filmSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardContainer, this._filmSortingComponent, `beforeend`); // Render sorting block
  }

  _clearFilmList() {
    Object
      .values(this._filmCardPresenterObserver)
      .forEach((presenter) => presenter.destroy());
    this._filmCardPresenterObserver = {};
    this._renderedFilmCards = FILM_CARD_AMOUNT_PER_STEP;
  }

  _handleModeChange() {
    Object
      .values(this._filmCardPresenterObserver)
      .forEach((presenter) => presenter.resetView());
  }

  _prepareEmptyBoard() {
    // Render empty board
    // Define empty film card container
    render(this._boardContainer, this._filmBoardComponent, `beforeend`);
    this._filmList = this._filmBoardComponent.getElement().querySelector(`.films-list .films-list__container`);
  }

  _renderBoard() {
    const filmCards = this._getFilmCards();
    const filmCardsCount = filmCards.length;

    if (filmCardsCount === 0) {
      this._prepareEmptyBoard();
      this._renderNoFilms(); // Render plug
      return;
    }

    this._renderSort(); // Render sorting block
    this._prepareEmptyBoard();

    this._renderCardsList(filmCards.slice(0, Math.min(filmCardsCount, this._renderedFilmCards))); // Render cards + button
    this._renderExtraFilmCards(); // Render extra cards
  }

  _clearBoard({resetRenderedFilmCardsCount = false, resetSortType = false} = {}) {
    const filmCardsCount = this._getFilmCards().length;

    Object
      .values(this._filmCardPresenterObserver)
      .forEach((presenter) => presenter.destroy());
    this._filmCardPresenterObserver = {};

    remove(this._filmSortingComponent);
    remove(this._filmBoardComponent);
    remove(this._noFilmsComponent);

    if (this._loadMoreButtonComponent) {
      remove(this._loadMoreButtonComponent);
    }

    remove(this._topRatedComponent);
    remove(this._mostCommentedComponent);

    if (resetRenderedFilmCardsCount) {
      this._renderedFilmCards = FILM_CARD_AMOUNT_PER_STEP;
    } else {
      this._renderedFilmCards = Math.min(filmCardsCount, this._renderedFilmCards);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
