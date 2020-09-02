// Imports
import {renderTemplate, render} from './utils.js';
import {generateFilmCard} from './mock/film-card-mock.js';
import {generateFilter} from './mock/filter-mock.js';
import {generateUserProfile} from './mock/user-profile-mock.js';
import UserProfileView from './view/user-profile.js';
import SiteMenuView from './view/site-menu.js';
import FilmSortingView from './view/film-sorting.js';
import FilmBoardView from './view/film-board.js';
import FilmCardView from './view/film-card.js';
import LoadMoreButtonView from './view/load-more-button.js';
import {createExtraFilmCardTemplate} from './view/film-card-extra.js';
import FilmNumberView from './view/film-number.js';
import FilmDetailsPopupView from './view/film-popup.js';

// Constants
const FILM_CARD_AMOUNT = 20;
const FILM_CARD_AMOUNT_PER_STEP = 5; // Cards on board for each loading
const TOP_FILM_CARD_AMOUNT = 2;
const COMMENTED_FILM_CARD_AMOUNT = 2;

// HTML elements
const siteHeaderElement = document.querySelector(`.header`);
const	siteMainElement = document.querySelector(`.main`);
const	siteFooterElement = document.querySelector(`.footer`);

// Array with Film cards data
const filmCards = new Array(FILM_CARD_AMOUNT).fill().map(generateFilmCard);
// Array with filters - we filter through only rendered cards
let filters = generateFilter(filmCards.slice(0, FILM_CARD_AMOUNT_PER_STEP));
// User profile data
const userProfileData = generateUserProfile();

// Render
// - user profile
// - menu with filter block
// - sorting block
// - Empty board
render(siteHeaderElement, new UserProfileView(filmCards, userProfileData).getElement(), `beforeend`);
let siteMenuComponent = new SiteMenuView(filters);
render(siteMainElement, siteMenuComponent.getElement(), `beforeend`);
render(siteMainElement, new FilmSortingView().getElement(), `beforeend`);

const filmBoardComponent = new FilmBoardView(); // The whole board component
const filmBoardElement = filmBoardComponent.getElement();
render(siteMainElement, filmBoardElement, `beforeend`);

// Film board elements
const filmList = filmBoardElement.querySelector(`.films-list .films-list__container`); // Film cards container
const filmListTop = filmBoardElement.querySelector(`.films-list--extra:nth-child(2) .films-list__container`); // Top rated film cards container
const filmListCommented = filmBoardElement.querySelector(`.films-list--extra:nth-child(3) .films-list__container`); // Commented film cards container
const siteFooterStats = siteFooterElement.querySelector(`.footer__statistics`); // statistics block

// Render
// - film cards
// - button
// - top rated films
// - most commented films
// - film number in footer
// - Popup
for (let i = 0; i < FILM_CARD_AMOUNT_PER_STEP; i++) {
  render(filmList, new FilmCardView(filmCards[i]).getElement(), `beforeend`);
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
      .forEach((filmCard) => render(filmList, new FilmCardView(filmCard).getElement(), `beforeend`));

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

for (let i = 0; i < TOP_FILM_CARD_AMOUNT; i++) {
  renderTemplate(filmListTop, createExtraFilmCardTemplate(), `beforeend`);
}
for (let i = 0; i < COMMENTED_FILM_CARD_AMOUNT; i++) {
  renderTemplate(filmListCommented, createExtraFilmCardTemplate(), `beforeend`);
}

render(siteFooterStats, new FilmNumberView(filmCards).getElement(), `beforeend`);
render(siteFooterElement.parentElement, new FilmDetailsPopupView(filmCards[0]).getElement(), `beforeend`);
