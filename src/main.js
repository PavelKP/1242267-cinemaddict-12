// Imports
import {render} from './utils/render.js';
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
  render(container, filmCardComponent, `beforeend`);

  // Set handlers
  filmCardComponent.setPosterClickHandler(showPopup);
  filmCardComponent.setTitleClickHandler(showPopup);
  filmCardComponent.setCommentsClickHandler(showPopup);
  popupComponent.setPopupEscHandler(closePopup);
};

const renderBoard = (siteMainElement, filmCards) => {
  // Define the whole board component
  const filmBoardComponent = new FilmBoardView();
  // Define film cards container
  const filmList = filmBoardComponent.getElement().querySelector(`.films-list .films-list__container`);
  // Render the whole board component
  render(siteMainElement, filmBoardComponent, `beforeend`);

  if (filmCards.length > 0) {
    // Define top rated container
    const topRatedComponent = new TopRatedView();

    // Define most commented container
    const mostCommentedComponent = new MostCommentedView();

    // Render extra blocks
    render(filmBoardComponent, topRatedComponent, `beforeend`);
    render(filmBoardComponent, mostCommentedComponent, `beforeend`);

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

      render(filmList.parentElement, loadMoreButtonComponent, `beforeend`);

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
        render(siteMainElement, siteMenuComponent, `afterbegin`);

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
    const topRatedContainer = topRatedComponent.getElement().querySelector(`.films-list__container`);
    for (let i = 0; i < Math.min(filmCardsOrderByRating.length, TOP_FILM_CARD_AMOUNT); i++) {
      renderCard(topRatedContainer, filmCardsOrderByRating[i]);
    }

    // Copy film cards array and sort by comments amount
    const filmCardsOrderByComments = filmCards.slice().sort((a, b) => b.comments.length - a.comments.length);

    // Render most commented films
    const mostCommentedContainer = mostCommentedComponent.getElement().querySelector(`.films-list__container`);
    for (let i = 0; i < Math.min(filmCardsOrderByRating.length, COMMENTED_FILM_CARD_AMOUNT); i++) {
      renderCard(mostCommentedContainer, filmCardsOrderByComments[i]);
    }
  } else {
    // Render plug
    render(filmList, new NoFilmsView(), `beforeend`);
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
render(siteHeaderElement, new UserProfileView(filmCards, userProfileData), `beforeend`);
let siteMenuComponent = new SiteMenuView(filters);
render(siteMainElement, siteMenuComponent, `beforeend`);
render(siteMainElement, new FilmSortingView(), `beforeend`);
renderBoard(siteMainElement, filmCards);

// Find statistics block
// Render number of films
const siteFooterStats = siteFooterElement.querySelector(`.footer__statistics`);
render(siteFooterStats, new FilmNumberView(filmCards), `beforeend`);
