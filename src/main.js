// Imports
import {render, remove} from './utils/render.js';
import {generateFilmCard} from './mock/film-card-mock.js';
import FilmNumberView from './view/film-number.js';
import StatisticsView from './view/statistics.js';

import MovieListPresenter from './presenter/movie-list.js';
import FilterPresenter from './presenter/filter.js';
import UserProfilePresenter from './presenter/user-profile.js';

import FilmCardsModel from './model/movies.js';
import FilterModel from './model/filter.js';
import UserProfileModel from './model/user-profile.js';

// Constants
const FILM_CARD_AMOUNT = 20;

let statisticComponent;

const handleStatisticClick = () => {
  if (statisticComponent) {
    remove(statisticComponent);
  }
  movieListPresenter.destroy();
  statisticComponent = new StatisticsView(filmCardsModel.getFilmCards());
  render(siteMainElement, statisticComponent, `beforeend`);
};

const handleMenuItemClick = () => {
  if (movieListPresenter.destroyed) {
    movieListPresenter.init();
    remove(statisticComponent);
  }
};

// HTML elements
const siteHeaderElement = document.querySelector(`.header`);
const	siteMainElement = document.querySelector(`.main`);
const	siteFooterElement = document.querySelector(`.footer`);

// Array with Film cards data
// User profile data
const filmCards = new Array(FILM_CARD_AMOUNT).fill().map(generateFilmCard);

// Models
const filmCardsModel = new FilmCardsModel();
filmCardsModel.setFilmCards(filmCards);

const filterModel = new FilterModel();

const userProfileModel = new UserProfileModel();
userProfileModel.countRank(filmCards);

// Render user profile
const userProfilePresenter = new UserProfilePresenter(siteHeaderElement, userProfileModel, filmCardsModel);
userProfilePresenter.init();

// Render menu with filter block
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmCardsModel, handleStatisticClick, handleMenuItemClick);
filterPresenter.init();

// Render board
const movieListPresenter = new MovieListPresenter(siteMainElement, filmCardsModel, filterModel);
movieListPresenter.init();

// Render number of films
const siteFooterStats = siteFooterElement.querySelector(`.footer__statistics`);
render(siteFooterStats, new FilmNumberView(filmCards), `beforeend`);
