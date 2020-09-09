// Imports
import {render} from './utils/render.js';
import {generateFilmCard} from './mock/film-card-mock.js';
import {generateFilter} from './mock/filter-mock.js';
import {generateUserProfile} from './mock/user-profile-mock.js';
import UserProfileView from './view/user-profile.js';
import SiteMenuView from './view/site-menu.js';
import MovieListPresenter from './presenter/movie-list.js';
import FilmNumberView from './view/film-number.js';

// Constants
const FILM_CARD_AMOUNT = 20;
const FILM_CARD_AMOUNT_PER_STEP = 5; // Cards on board for each loading

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
render(siteHeaderElement, new UserProfileView(filmCards, userProfileData), `beforeend`);
let siteMenuComponent = new SiteMenuView(filters);
render(siteMainElement, siteMenuComponent, `beforeend`);

// Render board
const movieListPresenter = new MovieListPresenter(siteMainElement);
movieListPresenter.init(filmCards);

// Find statistics block
// Render number of films
const siteFooterStats = siteFooterElement.querySelector(`.footer__statistics`);
render(siteFooterStats, new FilmNumberView(filmCards), `beforeend`);
