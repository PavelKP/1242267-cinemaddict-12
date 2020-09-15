import FilmBoardView from '../view/film-board.js';
import SiteMenuView from '../view/site-menu.js';
import FilmCardPresenter from '../presenter/film-card.js';
import LoadMoreButtonView from '../view/load-more-button.js';
import TopRatedView from '../view/top-rated.js';
import MostCommentedView from '../view/most-commented.js';
import NoFilmsView from '../view/no-films.js';
import FilmSortingView from '../view/film-sorting.js';
import {render, remove} from '../utils/render.js';
import {generateFilter} from '../mock/filter-mock.js';
import {SortType} from '../const.js';
import {updateItem} from '../utils/common.js';
import {sortByDate, sortByRating} from '../utils/film-cards.js';

// Constants
const FILM_CARD_AMOUNT_PER_STEP = 5; // Cards on board for each loading
const TOP_FILM_CARD_AMOUNT = 2;
const COMMENTED_FILM_CARD_AMOUNT = 2;
const IdType = {
  TOP_RATED: `topRated`,
  MOST_COMMENTED: `mostCommented`,
};

export default class MovieList {
  constructor(boardContainer, filmCardsModel) {
    this._filmCardsModel = filmCardsModel;
    this._boardContainer = boardContainer;

    this._currentSortType = SortType.DEFAULT;
    this._renderedFilmCards = FILM_CARD_AMOUNT_PER_STEP;
    this._filmCardPresenterObserver = {};


    this._filmBoardComponent = new FilmBoardView();
    this._filmSortingComponent = new FilmSortingView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._topRatedComponent = new TopRatedView();
    this._mostCommentedComponent = new MostCommentedView();
    this._noFilmsComponent = new NoFilmsView();

    this._filmList = this._filmBoardComponent.getElement().querySelector(`.films-list .films-list__container`);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilmCardChange = this._handleFilmCardChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init() {
    // Render sorting block
    // Render empty board
    this._renderSort();
    render(this._boardContainer, this._filmBoardComponent, `beforeend`);

    this._renderBoard();
  }

  _getFilmCards() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmCardsModel.getFilmCards().slice().sort(sortByDate);
      case SortType.RATING:
        return this._filmCardsModel.getFilmCards().slice().sort(sortByRating);
    }

    return this._filmCardsModel.getFilmCards();
  }

  _renderCard(container, card, modifier = ``) {
    const filmCardPresenter = new FilmCardPresenter(container, this._handleFilmCardChange, this._handleModeChange);
    filmCardPresenter.init(card);
    this._filmCardPresenterObserver[modifier + card.id] = filmCardPresenter;
  }

  _renderCards(filmCards) {
    for (let i = 0; i < filmCards.length; i++) {
      this._renderCard(this._filmList, filmCards[i]);
    }
  }

  _renderCardsList() {
    const filmCardsCount = this._getFilmCards().length;
    const filmCards = this._getFilmCards()
        .slice(0, Math.min(filmCardsCount, FILM_CARD_AMOUNT_PER_STEP));

    this._renderCards(filmCards);

    if (filmCardsCount > FILM_CARD_AMOUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _refreshSiteMenu(renderedFilmCards) {
    // Generate new filters array from cards on board
    // Define component
    const filters = generateFilter(this._getFilmCards().slice(0, renderedFilmCards));
    this._siteMenuComponent = new SiteMenuView(filters);

    // Remove old site menu
    // Render new site menu
    this._boardContainer.querySelector(`.main-navigation`).remove();
    render(this._boardContainer, this._siteMenuComponent, `afterbegin`);
  }

  _handleLoadMoreButtonClick() {
    const filmCardsCount = this._getFilmCards().length;
    const newRenderedFilmCardsCount = Math.min(filmCardsCount, this._renderedFilmCards + FILM_CARD_AMOUNT_PER_STEP);
    const filmCards = this._getFilmCards().slice(this._renderedFilmCards, newRenderedFilmCardsCount);

    this._renderCards(filmCards);
    this._renderedFilmCards += FILM_CARD_AMOUNT_PER_STEP; // Rendered cards + rendered after click

    this._refreshSiteMenu(this._renderedFilmCards);

    // Remove button if nothing to render
    if (this._renderedFilmCards >= filmCardsCount) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    // Render load more button
    render(this._filmList.parentElement, this._loadMoreButtonComponent, `beforeend`);

    this._loadMoreButtonComponent.setLoadMoreButtonHandler((evt) => {
      evt.preventDefault();
      this._handleLoadMoreButtonClick();
    });
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
    this._renderCardsList();
    this._renderExtraFilmCards();
    this._renderLoadMoreButton();
  }

  _runInitByProperty(key, updatedFilmCard) {
    if (this._filmCardPresenterObserver.hasOwnProperty((key))) {
      this._filmCardPresenterObserver[key].init(updatedFilmCard);
    }
  }

  _handleFilmCardChange(updatedFilmCard) {
    this._filmCards = updateItem(this._filmCards, updatedFilmCard);
    this._sourcedFilmCards = updateItem(this._sourcedFilmCards, updatedFilmCard);

    const clearId = String(updatedFilmCard.id).match(/(\d+)$/g);
    this._runInitByProperty(clearId, updatedFilmCard);

    this._runInitByProperty(IdType.TOP_RATED + clearId, updatedFilmCard);
    this._runInitByProperty(IdType.MOST_COMMENTED + clearId, updatedFilmCard);
  }

  _renderSort() {
    render(this._boardContainer, this._filmSortingComponent, `beforeend`); // Render sorting block
    this._filmSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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

  _renderBoard() {
    if (this._getFilmCards().length > 0) {
      this._renderCardsList(); // Render cards + button
      this._renderExtraFilmCards(); // Render extra cards
    } else {
      this._renderNoFilms(); // Render plug
    }
  }
}
