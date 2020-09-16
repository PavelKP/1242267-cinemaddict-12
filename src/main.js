// Imports
import {render} from './utils/render.js';
import {generateFilmCard} from './mock/film-card-mock.js';
import {generateUserProfile} from './mock/user-profile-mock.js';
import UserProfileView from './view/user-profile.js';
import FilmNumberView from './view/film-number.js';

import MovieListPresenter from './presenter/movie-list.js';
import FilterPresenter from './presenter/filter.js';

import FilmCardsModel from './model/movies.js';
import FilterModel from './model/filter.js';

// Constants
const FILM_CARD_AMOUNT = 20;

// HTML elements
const siteHeaderElement = document.querySelector(`.header`);
const	siteMainElement = document.querySelector(`.main`);
const	siteFooterElement = document.querySelector(`.footer`);

// Array with Film cards data
// User profile data
const filmCards = new Array(FILM_CARD_AMOUNT).fill().map(generateFilmCard);
const userProfileData = generateUserProfile();

// Models
const filmCardsModel = new FilmCardsModel();
filmCardsModel.setFilmCards(filmCards);

const filterModel = new FilterModel();

// Render user profile
render(siteHeaderElement, new UserProfileView(filmCards, userProfileData), `beforeend`);

// Render menu with filter block
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmCardsModel);
filterPresenter.init();

// Render board
const movieListPresenter = new MovieListPresenter(siteMainElement, filmCardsModel, filterModel, filterPresenter);
movieListPresenter.init();

// Find statistics block
// Render number of films
const siteFooterStats = siteFooterElement.querySelector(`.footer__statistics`);
render(siteFooterStats, new FilmNumberView(filmCards), `beforeend`);
