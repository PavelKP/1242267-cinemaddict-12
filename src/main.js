// Imports
import {generateFilmCard} from './mock/film-card-mock.js';
import {render} from './utils.js'; // Render a template in certain block
import {createUserProfileTemplate} from './view/user-profile.js';
import {createSiteMenuTemplate} from './view/site-menu.js';
import {createFilmSortingTemplate} from './view/film-sorting.js';
import {createFilmBoardTemplate} from './view/film-board.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createLoadMoreButtonTemplate} from './view/load-more-button.js';
import {createExtraFilmCardTemplate} from './view/film-card-extra.js';
import {createFilmNumberTemplate} from './view/film-number.js';
import {createFilmDetailsPopup} from './view/film-popup.js';

// Constants
const FILM_CARD_AMOUNT = 20;
const TOP_FILM_CARD_AMOUNT = 2;
const COMMENTED_FILM_CARD_AMOUNT = 2;

// HTML elements
const siteHeaderElement = document.querySelector(`.header`);
const	siteMainElement = document.querySelector(`.main`);
const	siteFooterElement = document.querySelector(`.footer`);

// Array with Film cards data
const filmCards = new Array(FILM_CARD_AMOUNT).fill().map(generateFilmCard);

// Render elements
render(siteHeaderElement, createUserProfileTemplate(), `beforeend`);
render(siteMainElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createFilmSortingTemplate(), `beforeend`);
render(siteMainElement, createFilmBoardTemplate(), `beforeend`);

// Film board and its elements
const filmBoardElement = siteMainElement.querySelector(`.films`); // The whole board
const filmList = filmBoardElement.querySelector(`.films-list .films-list__container`); // Film cards container
const filmListTop = filmBoardElement.querySelector(`.films-list--extra:nth-child(2) .films-list__container`); // Top rated film cards container
const filmListCommented = filmBoardElement.querySelector(`.films-list--extra:nth-child(3) .films-list__container`); // Commented film cards container
const siteFooterStats = siteFooterElement.querySelector(`.footer__statistics`);

// Render film cards
// Render button
// Render top rated films
// Render most commented films
// Render film number in footer
// Render Popup
for (let i = 0; i < FILM_CARD_AMOUNT; i++) {
  render(filmList, createFilmCardTemplate(filmCards[i]), `beforeend`);
}
render(filmList, createLoadMoreButtonTemplate(), `afterend`);
for (let i = 0; i < TOP_FILM_CARD_AMOUNT; i++) {
  render(filmListTop, createExtraFilmCardTemplate(), `beforeend`);
}
for (let i = 0; i < COMMENTED_FILM_CARD_AMOUNT; i++) {
  render(filmListCommented, createExtraFilmCardTemplate(), `beforeend`);
}

render(siteFooterStats, createFilmNumberTemplate(filmCards), `beforeend`);
render(siteFooterElement, createFilmDetailsPopup(filmCards[0]), `afterend`);
