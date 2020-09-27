import {DESCRIPTION_LIMIT} from '../const.js';
import {formatYear, shortenString, formatDuration} from '../utils/film-cards.js';
import AbstractView from './abstract.js';


const createFilmCardTemplate = (filmCard) => {

  const {title, rating, release, duration, genres, poster, description, comments, isWatched, isFavorite, isListed} = filmCard;

  const formattedRating = (rating.toString().length === 1) ? `${rating}.0` : rating;
  const releaseYear = formatYear(release);
  const formattedDuration = formatDuration(duration);
  const firstGenre = genres[0];
  const commentsAmount = comments.length;
  const shortDescription = shortenString(description, DESCRIPTION_LIMIT);

  const watchedActiveClassName = isWatched ? `film-card__controls-item--active` : ``;
  const favoriteActiveClassName = isFavorite ? `film-card__controls-item--active` : ``;
  const listedActiveClassName = isListed ? `film-card__controls-item--active` : ``;

  return (
    `<article class="film-card">
		<h3 class="film-card__title">${title}</h3>
		<p class="film-card__rating">${formattedRating}</p>
		<p class="film-card__info">
			<span class="film-card__year">${releaseYear}</span>
			<span class="film-card__duration">${formattedDuration}</span>
			<span class="film-card__genre">${firstGenre}</span>
		</p>
		<img src="${poster}" alt="${title}" class="film-card__poster">
		<p class="film-card__description">${shortDescription}</p>
		<a class="film-card__comments">${commentsAmount} comments</a>
		<form class="film-card__controls">
			<button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${listedActiveClassName}">Add to watchlist</button>
			<button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedActiveClassName}">Mark as watched</button>
			<button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteActiveClassName}">Mark as favorite</button>
		</form>
	</article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(card) {
    super();
    this._card = card;
    this._posterClickHandler = this._posterClickHandler.bind(this);
    this._titleClickHandler = this._titleClickHandler.bind(this);
    this._commentsClickHandler = this._commentsClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

  }

  _getTemplate() {
    return createFilmCardTemplate(this._card);
  }

  setPosterClickHandler(callback) {
    this._callback.posterClickHandler = callback;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._posterClickHandler);
  }
  setTitleClickHandler(callback) {
    this._callback.titleClickHandler = callback;
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._titleClickHandler);
  }
  setCommentsClickHandler(callback) {
    this._callback.commentsClickHandler = callback;
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._commentsClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClickHandler = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClickHandler = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._historyClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClickHandler = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  _posterClickHandler(evt) {
    this._callback.posterClickHandler(evt);
  }
  _titleClickHandler(evt) {
    this._callback.titleClickHandler(evt);
  }
  _commentsClickHandler(evt) {
    this._callback.commentsClickHandler(evt);
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClickHandler();
  }

  _historyClickHandler(evt) {
    evt.preventDefault();
    this._callback.historyClickHandler();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClickHandler();
  }
}
