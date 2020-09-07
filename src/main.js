// Imports
import {render} from './utils.js';
import {generateFilmCard} from './mock/film-card-mock.js';
import {generateFilter} from './mock/filter-mock.js';
import {generateUserProfile} from './mock/user-profile-mock.js';
import UserProfileView from './view/user-profile.js';
import SiteMenuView from './view/site-menu.js';
import FilmSortingView from './view/film-sorting.js';
import FilmBoardView from './view/film-board.js';
import FilmCardView from './view/film-card.js';
import LoadMoreButtonView from './view/load-more-button.js';
import FilmNumberView from './view/film-number.js';
import FilmDetailsPopupView from './view/film-popup.js';
import TopRatedView from './view/top-rated.js';
import MostCommentedView from './view/most-commented.js';
import NoFilmsView from './view/no-films.js';

// Constants
const FILM_CARD_AMOUNT = 20;
const FILM_CARD_AMOUNT_PER_STEP = 5; // Cards on board for each loading
const TOP_FILM_CARD_AMOUNT = 2;
const COMMENTED_FILM_CARD_AMOUNT = 2;

// Functions
const renderCard = (container, card) => {
  // Show popup
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

  // Create components
  // Render film card
  const filmCardComponent = new FilmCardView(card);
  const popupComponent = new FilmDetailsPopupView(card);
  render(container, filmCardComponent.getElement(), `beforeend`);

  // Find card elements
  const poster = filmCardComponent.getElement().querySelector(`.film-card__poster`);
  const title = filmCardComponent.getElement().querySelector(`.film-card__title`);
  const commentsAmount = filmCardComponent.getElement().querySelector(`.film-card__comments`);
  // Find popup elements
  const closeButton = popupComponent.getElement().querySelector(`.film-details__close-btn`);

  // Add listeners
  poster.addEventListener(`click`, (evt) => showPopup(evt));
  title.addEventListener(`click`, (evt) => showPopup(evt));
  commentsAmount.addEventListener(`click`, (evt) => showPopup(evt));
  closeButton.addEventListener(`click`, (evt) => closePopup(evt));
};

const renderBoard = (siteMainElement, filmCards) => {
  // Define the whole board component
  const filmBoardComponent = new FilmBoardView();
  const filmBoardElement = filmBoardComponent.getElement();
  // Define film cards container
  const filmList = filmBoardElement.querySelector(`.films-list .films-list__container`);
  // Render the whole board component
  render(siteMainElement, filmBoardElement, `beforeend`);

  if (filmCards.length > 0) {
    // Define top rated container
    const topRatedElement = new TopRatedView().getElement();
    const topRatedContainer = topRatedElement.querySelector(`.films-list__container`);

    // Define most commented container
    const mostCommentedElement = new MostCommentedView().getElement();
    const mostCommentedContainer = mostCommentedElement.querySelector(`.films-list__container`);

    // Render extra blocks
    render(filmBoardElement, topRatedElement, `beforeend`);
    render(filmBoardElement, mostCommentedElement, `beforeend`);

    // Render
    // - film cards
    // - button
    for (let i = 0; i < Math.min(filmCards.length, FILM_CARD_AMOUNT_PER_STEP); i++) {
      renderCard(filmList, filmCards[i]);
    }

    // Render load more button
    if (filmCards.length > FILM_CARD_AMOUNT_PER_STEP) {

      let renderedFilmCards = FILM_CARD_AMOUNT_PER_STEP; // Rendered cards
      const loadMoreButtonComponent = new LoadMoreButtonView(); // Define button component

      render(filmList.parentElement, loadMoreButtonComponent.getElement(), `beforeend`);

      loadMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
        evt.preventDefault();
        filmCards
          .slice(renderedFilmCards, renderedFilmCards + FILM_CARD_AMOUNT_PER_STEP)
          .forEach((filmCard) => renderCard(filmList, filmCard));

        renderedFilmCards += FILM_CARD_AMOUNT_PER_STEP; // Rendered cards + rendered after click

        // Remove old site menu through component
        // Generate new filters array from cards on board
        // Override component with new data
        // Render new site menu
        siteMenuComponent.getElement().remove();
        filters = generateFilter(filmCards.slice(0, renderedFilmCards));
        siteMenuComponent = new SiteMenuView(filters);
        render(siteMainElement, siteMenuComponent.getElement(), `afterbegin`);

        // Remove popup if nothing to render
        if (renderedFilmCards >= filmCards.length) {
          loadMoreButtonComponent.getElement().remove();
          loadMoreButtonComponent.removeElement();
        }

      });
    }
    // Copy film cards array and sort by rating
    const filmCardsOrderByRating = filmCards.slice().sort((a, b) => b.rating - a.rating);
    // Render top rated films
    for (let i = 0; i < Math.min(filmCardsOrderByRating.length, TOP_FILM_CARD_AMOUNT); i++) {
      renderCard(topRatedContainer, filmCardsOrderByRating[i]);
    }

    // Copy film cards array and sort by comments amount
    const filmCardsOrderByComments = filmCards.slice().sort((a, b) => b.comments.length - a.comments.length);
    // Render most commented films
    for (let i = 0; i < Math.min(filmCardsOrderByRating.length, COMMENTED_FILM_CARD_AMOUNT); i++) {
      renderCard(mostCommentedContainer, filmCardsOrderByComments[i]);
    }
  } else {
    // Render plug
    render(filmList, new NoFilmsView().getElement(), `beforeend`);
  }
};

// HTML elements
const siteHeaderElement = document.querySelector(`.header`);
const	siteMainElement = document.querySelector(`.main`);
const	siteFooterElement = document.querySelector(`.footer`);

// Array with Film cards data
// Array with filters - we filter through only rendered cards
// User profile data
const filmCards = new Array(FILM_CARD_AMOUNT).fill().map(generateFilmCard);
let filters = generateFilter(filmCards.slice(0, FILM_CARD_AMOUNT_PER_STEP));
const userProfileData = generateUserProfile();

// Render
// - user profile
// - menu with filter block
// - sorting block
// - board
render(siteHeaderElement, new UserProfileView(filmCards, userProfileData).getElement(), `beforeend`);
let siteMenuComponent = new SiteMenuView(filters);
render(siteMainElement, siteMenuComponent.getElement(), `beforeend`);
render(siteMainElement, new FilmSortingView().getElement(), `beforeend`);
renderBoard(siteMainElement, filmCards);

// Find statistics block
// Render number of films
const siteFooterStats = siteFooterElement.querySelector(`.footer__statistics`);
render(siteFooterStats, new FilmNumberView(filmCards).getElement(), `beforeend`);
