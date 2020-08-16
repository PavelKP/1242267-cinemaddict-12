// Imports
import {generateFilmCard} from './mock/film-card-mock.js';
import {generateFilter} from './mock/filter-mock.js';
import {generateUserProfile} from './mock/user-profile-mock.js';
import {createUserProfileTemplate} from './view/user-profile.js';
import {createSiteMenuTemplate} from './view/site-menu.js';
import {createFilmSortingTemplate} from './view/film-sorting.js';
import {createFilmBoardTemplate} from './view/film-board.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createLoadMoreButtonTemplate} from './view/load-more-button.js';
import {createExtraFilmCardTemplate} from './view/film-card-extra.js';
import {createFilmNumberTemplate} from './view/film-number.js';
import {createFilmDetailsPopup} from './view/film-popup.js';
import {renderTemplate} from './utils.js';

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
renderTemplate(siteHeaderElement, createUserProfileTemplate(filmCards, userProfileData), `beforeend`);
renderTemplate(siteMainElement, createSiteMenuTemplate(filters), `beforeend`);
renderTemplate(siteMainElement, createFilmSortingTemplate(), `beforeend`);
renderTemplate(siteMainElement, createFilmBoardTemplate(), `beforeend`);

// Film board and its elements
const filmBoardElement = siteMainElement.querySelector(`.films`); // The whole board
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
  renderTemplate(filmList, createFilmCardTemplate(filmCards[i]), `beforeend`);
}

// Render load more button
if (filmCards.length > FILM_CARD_AMOUNT_PER_STEP) {

  let renderedFilmCards = FILM_CARD_AMOUNT_PER_STEP; // Rendered cards

  renderTemplate(filmList, createLoadMoreButtonTemplate(), `afterend`);

  const loadMoreButton = filmBoardElement.querySelector(`.films-list__show-more`);
  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    filmCards
      .slice(renderedFilmCards, renderedFilmCards + FILM_CARD_AMOUNT_PER_STEP)
      .forEach((filmCard) => renderTemplate(filmList, createFilmCardTemplate(filmCard), `beforeend`));

    renderedFilmCards += FILM_CARD_AMOUNT_PER_STEP; // Rendered cards + rendered after click

    // Remove old site menu
    // Generate new filters array from cards on board
    // Render new site menu
    siteMainElement.querySelector(`.main-navigation`).remove();
    filters = generateFilter(filmCards.slice(0, renderedFilmCards));
    renderTemplate(siteMainElement, createSiteMenuTemplate(filters), `afterbegin`);

    // Remove popup if nothing to render
    if (renderedFilmCards >= filmCards.length) {
      loadMoreButton.remove();
    }

  });
}

for (let i = 0; i < TOP_FILM_CARD_AMOUNT; i++) {
  renderTemplate(filmListTop, createExtraFilmCardTemplate(), `beforeend`);
}
for (let i = 0; i < COMMENTED_FILM_CARD_AMOUNT; i++) {
  renderTemplate(filmListCommented, createExtraFilmCardTemplate(), `beforeend`);
}

renderTemplate(siteFooterStats, createFilmNumberTemplate(filmCards), `beforeend`);
renderTemplate(siteFooterElement, createFilmDetailsPopup(filmCards[0]), `afterend`);
