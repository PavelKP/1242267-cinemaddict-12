import FilmBoardView from '../view/film-board.js';
import SiteMenuView from '../view/site-menu.js';
import FilmCardPresenter from "../presenter/film-card.js";
import LoadMoreButtonView from '../view/load-more-button.js';
import TopRatedView from '../view/top-rated.js';
import MostCommentedView from '../view/most-commented.js';
import NoFilmsView from '../view/no-films.js';
import FilmSortingView from '../view/film-sorting.js';
import {render, remove} from '../utils/render.js';
import {generateFilter} from '../mock/filter-mock.js';
import {SortType} from '../const.js';
import {sortByDate, sortByRating} from '../utils/film-cards.js';

// Constants
const FILM_CARD_AMOUNT_PER_STEP = 5; // Cards on board for each loading
const TOP_FILM_CARD_AMOUNT = 2;
const COMMENTED_FILM_CARD_AMOUNT = 2;

export default class MovieList {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._filmBoardComponent = new FilmBoardView();
    this._filmSortingComponent = new FilmSortingView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._topRatedComponent = new TopRatedView();
    this._mostCommentedComponent = new MostCommentedView();
    this._noFilmsComponent = new NoFilmsView();

    this._filmList = this._filmBoardComponent.getElement().querySelector(`.films-list .films-list__container`);

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._currentSortType = SortType.DEFAULT;
  }

  init(filmCards) {
    this._filmCards = filmCards.slice();
    this._sourcedFilmCards = filmCards.slice(); // original array with cards

    // Render sorting block
    // Render empty board
    this._renderSort();
    render(this._boardContainer, this._filmBoardComponent, `beforeend`);

    this._renderBoard();
  }

  _renderCard(container, card) {
    const filmCardPresenter = new FilmCardPresenter(container);
    filmCardPresenter.init(card);
  }

  _renderCards() {
    for (let i = 0; i < Math.min(this._filmCards.length, FILM_CARD_AMOUNT_PER_STEP); i++) {
      this._renderCard(this._filmList, this._filmCards[i]);
    }
  }

  _refreshSiteMenu(renderedFilmCards) {
    // Generate new filters array from cards on board
    // Define component
    const filters = generateFilter(this._filmCards.slice(0, renderedFilmCards));
    this._siteMenuComponent = new SiteMenuView(filters);

    // Remove old site menu
    // Render new site menu
    this._boardContainer.querySelector(`.main-navigation`).remove();
    render(this._boardContainer, this._siteMenuComponent, `afterbegin`);
  }

  _handleLoadMoreButtonClick() {
    this._filmCards
      .slice(this._renderedFilmCards, this._renderedFilmCards + FILM_CARD_AMOUNT_PER_STEP)
      .forEach((filmCard) => this._renderCard(this._filmList, filmCard));

    this._renderedFilmCards += FILM_CARD_AMOUNT_PER_STEP; // Rendered cards + rendered after click

    this._refreshSiteMenu(this._renderedFilmCards);

    // Remove button if nothing to render
    if (this._renderedFilmCards >= this._filmCards.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    // Render load more button
    if (this._filmCards.length > FILM_CARD_AMOUNT_PER_STEP) {

      this._renderedFilmCards = FILM_CARD_AMOUNT_PER_STEP; // Rendered cards
      render(this._filmList.parentElement, this._loadMoreButtonComponent, `beforeend`);

      this._loadMoreButtonComponent.setLoadMoreButtonHandler((evt) => {
        evt.preventDefault();
        this._handleLoadMoreButtonClick();
      });
    }
  }

  _renderExtraFilmCards() {
    render(this._filmBoardComponent, this._topRatedComponent, `beforeend`); // Render top rated block
    render(this._filmBoardComponent, this._mostCommentedComponent, `beforeend`); // Render most commented block

    // Copy film cards array and sort by rating
    // Render top rated films
    const filmCardsOrderByRating = this._filmCards.slice().sort((a, b) => b.rating - a.rating);
    const topRatedContainer = this._topRatedComponent.getElement().querySelector(`.films-list__container`);
    for (let i = 0; i < Math.min(filmCardsOrderByRating.length, TOP_FILM_CARD_AMOUNT); i++) {
      this._renderCard(topRatedContainer, filmCardsOrderByRating[i]);
    }

    // Copy film cards array and sort by comments amount
    // Render most commented films
    const filmCardsOrderByComments = this._filmCards.slice().sort((a, b) => b.comments.length - a.comments.length);
    const mostCommentedContainer = this._mostCommentedComponent.getElement().querySelector(`.films-list__container`);
    for (let i = 0; i < Math.min(filmCardsOrderByRating.length, COMMENTED_FILM_CARD_AMOUNT); i++) {
      this._renderCard(mostCommentedContainer, filmCardsOrderByComments[i]);
    }
  }

  _renderNoFilms() {
    render(this._filmList, this._noFilmsComponent, `beforeend`);
  }

  _sortFilmCards(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._filmCards.sort(sortByDate);
        break;
      case SortType.RATING:
        this._filmCards.sort(sortByRating);
        break;
      default: this._filmCards = this._sourcedFilmCards.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortFilmCards(sortType);
    this._clearFilmList();
    this._renderCards();
    this._renderLoadMoreButton();
  }

  _renderSort() {
    render(this._boardContainer, this._filmSortingComponent, `beforeend`); // Render sorting block
    this._filmSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _clearFilmList() {
    this._filmList.innerHTML = ``;
    this._renderedFilmCards = FILM_CARD_AMOUNT_PER_STEP;
  }

  _renderBoard() {
    if (this._filmCards.length > 0) {
      this._renderCards(); // Render cards
      this._renderLoadMoreButton(); // Render load more button
      this._renderExtraFilmCards(); // Render extra cards
    } else {
      this._renderNoFilms(); // Render plug
    }
  }
}
