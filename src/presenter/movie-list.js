import FilmBoardView from '../view/film-board.js';
import SiteMenuView from '../view/site-menu.js';
import FilmCardView from '../view/film-card.js';
import LoadMoreButtonView from '../view/load-more-button.js';
import FilmDetailsPopupView from '../view/film-popup.js';
import TopRatedView from '../view/top-rated.js';
import MostCommentedView from '../view/most-commented.js';
import NoFilmsView from '../view/no-films.js';
import {render, remove} from '../utils/render.js';
import {generateFilter} from '../mock/filter-mock.js';

// Constants
const FILM_CARD_AMOUNT_PER_STEP = 5; // Cards on board for each loading
const TOP_FILM_CARD_AMOUNT = 2;
const COMMENTED_FILM_CARD_AMOUNT = 2;

export default class MovieList {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._filmBoardComponent = new FilmBoardView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._topRatedComponent = new TopRatedView();
    this._mostCommentedComponent = new MostCommentedView();
    this._noFilmsComponent = new NoFilmsView();

    this._filmList = this._filmBoardComponent.getElement().querySelector(`.films-list .films-list__container`);
  }

  init(filmCards) {
    this._filmCards = filmCards.slice();

    render(this._boardContainer, this._filmBoardComponent, `beforeend`);

    this._renderBoard();
  }

  _renderCard(container, card) {
    const filmCardComponent = new FilmCardView(card);
    const popupComponent = new FilmDetailsPopupView(card);
    render(container, filmCardComponent, `beforeend`);

    const showPopup = (evt) => {
      evt.preventDefault();
      document.body.appendChild(popupComponent.getElement());
      // Set handler on ESC down
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    // Close popup
    const closePopup = (evt) => {
      evt.preventDefault();
      document.body.removeChild(popupComponent.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    // Close popup on ESC
    const onEscKeyDown = (evt) => {
      if (evt.keyCode === 27) {
        closePopup(evt);
      }
    };

    // Set handlers
    filmCardComponent.setPosterClickHandler(showPopup);
    filmCardComponent.setTitleClickHandler(showPopup);
    filmCardComponent.setCommentsClickHandler(showPopup);
    popupComponent.setPopupCloseButtonHandler(closePopup);
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
