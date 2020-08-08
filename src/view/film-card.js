import {humanizeYear} from '../utils.js';

export const createFilmCardTemplate = (filmCard) => {
  const ACTIVE_CONTROL = `film-card__controls-item--active`;

  const {title, rating, release, duration, genres, poster, description, comments} = filmCard;
  let {watched, favorite, inList} = filmCard;

  watched = (watched) ? ACTIVE_CONTROL : ``;
  favorite = (favorite) ? ACTIVE_CONTROL : ``;
  inList = (inList) ? ACTIVE_CONTROL : ``;

  return (
    `<article class="film-card">
		<h3 class="film-card__title">${title}</h3>
		<p class="film-card__rating">${rating}</p>
		<p class="film-card__info">
			<span class="film-card__year">${humanizeYear(release)}</span>
			<span class="film-card__duration">${duration}</span>
			<span class="film-card__genre">${genres[0]}</span>
		</p>
		<img src="./images/posters/${poster}" alt="${title}" class="film-card__poster">
		<p class="film-card__description">${description}</p>
		<a class="film-card__comments">${comments.length} comments</a>
		<form class="film-card__controls">
			<button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${inList}">Add to watchlist</button>
			<button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watched}">Mark as watched</button>
			<button class="film-card__controls-item button film-card__controls-item--favorite ${favorite}">Mark as favorite</button>
		</form>
	</article>`
  );
};
