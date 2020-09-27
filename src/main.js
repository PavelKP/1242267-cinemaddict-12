// Imports
import {render, remove} from './utils/render.js';
import {UpdateType} from './const.js';
import FilmNumberView from './view/film-number.js';
import StatisticsView from './view/statistics.js';

import MovieListPresenter from './presenter/movie-list.js';
import FilterPresenter from './presenter/filter.js';
import UserProfilePresenter from './presenter/user-profile.js';

import FilmCardsModel from './model/movies.js';
import FilterModel from './model/filter.js';

import Api from './api.js';

// Constants
const AUTHORIZATION = `Basic qr866jdzbbs`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

// HTML elements
const siteHeaderElement = document.querySelector(`.header`);
const	siteMainElement = document.querySelector(`.main`);
const	siteFooterElement = document.querySelector(`.footer`);
const siteFooterStats = siteFooterElement.querySelector(`.footer__statistics`);

let statisticComponent;

const handleStatisticClick = () => {
  if (statisticComponent) {
    remove(statisticComponent);
  }
  movieListPresenter.destroy();
  movieListPresenter.destroySort();
  statisticComponent = new StatisticsView(filmCardsModel.getFilmCards());
  render(siteMainElement, statisticComponent, `beforeend`);
};

const handleMenuItemClick = () => {
  if (movieListPresenter.destroyed) {
    movieListPresenter.init();
    remove(statisticComponent);
  }
};

// Server
const api = new Api(END_POINT, AUTHORIZATION);
// Models
const filmCardsModel = new FilmCardsModel();
const filterModel = new FilterModel();
// View
const userProfilePresenter = new UserProfilePresenter(siteHeaderElement, filmCardsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmCardsModel, handleStatisticClick, handleMenuItemClick);
// Presenter
const movieListPresenter = new MovieListPresenter(siteMainElement, filmCardsModel, filterModel, api);

// Render user profile
userProfilePresenter.init();
// Render menu with filter block
filterPresenter.init();
// Render board
movieListPresenter.init();

api.getFilmCards()
  .then((cards) => api.pullComments(cards))
  .then((filmCards) => {
    filmCardsModel.setFilmCards(UpdateType.INIT, filmCards);
    // Render number of films
    render(siteFooterStats, new FilmNumberView(filmCards), `beforeend`);
    filterPresenter.unlock();
  })
  .catch((err) => {
    window.console.error(err);
    filmCardsModel.setFilmCards(UpdateType.INIT, []);
  });
