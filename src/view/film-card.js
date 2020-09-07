import {DESCRIPTION_LIMIT} from '../const.js';
import {formatYear, shortenString, convertMinutesToFilmLength} from '../utils.js';
import AbstractView from './abstract.js';


const createFilmCardTemplate = (filmCard) => {

  const {title, rating, release, duration, genres, poster, description, comments, isWatched, isFavorite, isListed} = filmCard;

  const releaseYear = formatYear(release);
  const formattedDuration = convertMinutesToFilmLength(duration);
  const firstGenre = genres[0];
  const commentsAmount = comments.length;
  const shortDescription = shortenString(description, DESCRIPTION_LIMIT);

  const watchedActiveClassName = isWatched ? `film-card__controls-item--active` : ``;
  const favoriteActiveClassName = isFavorite ? `film-card__controls-item--active` : ``;
  const listedActiveClassName = isListed ? `film-card__controls-item--active` : ``;


  return (
    `<article class="film-card">
		<h3 class="film-card__title">${title}</h3>
		<p class="film-card__rating">${rating}</p>
		<p class="film-card__info">
			<span class="film-card__year">${releaseYear}</span>
			<span class="film-card__duration">${formattedDuration}</span>
			<span class="film-card__genre">${firstGenre}</span>
		</p>
		<img src="./images/posters/${poster}" alt="${title}" class="film-card__poster">
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
  }

  _getTemplate() {
    return createFilmCardTemplate(this._card);
  }
}

