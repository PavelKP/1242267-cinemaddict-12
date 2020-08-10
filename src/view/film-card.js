import {humanizeYear} from '../utils.js';

export const createFilmCardTemplate = (filmCard) => {

  const {title, rating, release, duration, genres, poster, description, comments, isWatched, isFavorite, isListed} = filmCard;

  const watchedActiveClassName = isWatched ? `film-card__controls-item--active` : ``;
  const favoriteActiveClassName = isFavorite ? `film-card__controls-item--active` : ``;
  const listedActiveClassName = isListed ? `film-card__controls-item--active` : ``;
  const releaseYear = humanizeYear(release);
  const firstGenre = genres[0];
  const commentsAmount = comments.length;

  return (
    `<article class="film-card">
		<h3 class="film-card__title">${title}</h3>
		<p class="film-card__rating">${rating}</p>
		<p class="film-card__info">
			<span class="film-card__year">${releaseYear}</span>
			<span class="film-card__duration">${duration}</span>
			<span class="film-card__genre">${firstGenre}</span>
		</p>
		<img src="./images/posters/${poster}" alt="${title}" class="film-card__poster">
		<p class="film-card__description">${description}</p>
		<a class="film-card__comments">${commentsAmount} comments</a>
		<form class="film-card__controls">
			<button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${listedActiveClassName}">Add to watchlist</button>
			<button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedActiveClassName}">Mark as watched</button>
			<button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteActiveClassName}">Mark as favorite</button>
		</form>
	</article>`
  );
};
