import {formatCommentDate, formatReleaseDate, removeExtension, convertMinutesToFilmLength} from '../utils/film-cards.js';
import {EMOJI_FILE_NAMES} from '../const.js';
import AbstractView from './abstract.js';

// Create comments template
const createCommentTemplate = (commentsArray) => {

  // Iterate throw copy of array with comments
  // Destructure variables as parameters
  // Replace array element with template
  // Join array into string
  return commentsArray.map(({text, emoji, author, date}) => {
    const commentDate = formatCommentDate(date);
    const emojiAlt = removeExtension(emoji);

    return (`
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}" width="55" height="55" alt="${emojiAlt}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
    `);

  }).join(``);
};

const createEmojiList = (fileNames, checkedEmojiId) => {

  return fileNames.map((fileName) => {

    const checked = (checkedEmojiId === `emoji-${fileName}`) ? `checked` : ``;

    return (
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${fileName}" value="${fileName}" ${checked}>
      <label class="film-details__emoji-label" for="emoji-${fileName}">
        <img src="./images/emoji/${fileName}.png" data-file-name="${fileName}.png" width="30" height="30" alt="emoji">
      </label>
      `
    );
  }).join(``);
};

const createFilmDetailsPopup = (filmCard) => {

  const {title, rating, release, duration, poster, description, comments, ageRating, original, director, country, genres, writers, actors, isWatched, isFavorite, isListed, newComment} = filmCard;

  const writersList = writers.join(`, `);
  const actorsList = actors.join(`, `);
  const longReleaseDate = formatReleaseDate(release);
  const formattedDuration = convertMinutesToFilmLength(duration);
  const genresTitle = (genres.length > 1) ? `Genres` : `Genre`;
  const genresList = genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``);

  const isListedChecked = isListed ? `checked` : ``;
  const watchedChecked = isWatched ? `checked` : ``;
  const isFavoriteChecked = isFavorite ? `checked` : ``;

  const commentsTemplate = createCommentTemplate(comments);
  const commentsAmount = comments.length;

  const newEmoji = newComment.emoji ? `<img src="./images/emoji/${newComment.emoji}" width="55" height="55" alt="${removeExtension(newComment.emoji)}"></img>` : ``;
  const newCommentText = newComment.text ? newComment.text : ``;
  const checkedEmojiId = newComment.checkedEmojiId;

  return (
    `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="${title}">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${original}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writersList}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actorsList}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${longReleaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${formattedDuration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genresTitle}</td>
              <td class="film-details__cell">
                ${genresList}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isListedChecked}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watchedChecked}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavoriteChecked}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsAmount}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsTemplate}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">
            ${newEmoji}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newCommentText}</textarea>
          </label>

          <div class="film-details__emoji-list">
          ${createEmojiList(EMOJI_FILE_NAMES, checkedEmojiId)}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`
  );
};

export default class FilmDetailsPopup extends AbstractView {
  constructor(card) {
    super();
    this._data = FilmDetailsPopup.parseCardToData(card);

    this._popupCloseButtonHandler = this._popupCloseButtonHandler.bind(this);
    this._popupWatchlistClickHandler = this._popupWatchlistClickHandler.bind(this);
    this._popupHistoryClickHandler = this._popupHistoryClickHandler.bind(this);
    this._popupFavoriteClickHandler = this._popupFavoriteClickHandler.bind(this);

    this._popupEmojiClickHandler = this._popupEmojiClickHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);

    this._setInnerHandlers();
  }

  _getTemplate() {
    return createFilmDetailsPopup(this._data);
  }

  _popupCloseButtonHandler(evt) {
    this._callback.popupCloseButtonHandler(evt);
  }

  _popupWatchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.popupWatchlistClickHandler();
  }

  _popupHistoryClickHandler(evt) {
    evt.preventDefault();
    this._callback.popupHistoryClickHandler();
  }

  _popupFavoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.popupFavoriteClickHandler();
  }


  _popupEmojiClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `IMG`) {
      return;
    }

    this.updateData({
      newComment: Object.assign(
          {},
          this._data.newComment,
          {emoji: evt.target.dataset.fileName,
            checkedEmojiId: evt.target.parentElement.getAttribute(`for`)}
      )
    });
  }

  _commentInputHandler(evt) {
    evt.preventDefault();

    this.updateData({
      newComment: Object.assign(
          {},
          this._data.newComment,
          {text: evt.target.value}
      )
    }, true);
  }

  setPopupCloseButtonHandler(callback) {
    this._callback.popupCloseButtonHandler = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._popupCloseButtonHandler);
  }

  setPopupWatchlistClickHandler(callback) {
    this._callback.popupWatchlistClickHandler = callback;
    this.getElement().querySelector(`input[name="watchlist"]`).addEventListener(`click`, this._popupWatchlistClickHandler);
  }

  setPopupHistoryClickHandler(callback) {
    this._callback.popupHistoryClickHandler = callback;
    this.getElement().querySelector(`input[name="watched"]`).addEventListener(`click`, this._popupHistoryClickHandler);
  }

  setPopupFavoriteClickHandler(callback) {
    this._callback.popupFavoriteClickHandler = callback;
    this.getElement().querySelector(`input[name="favorite"]`).addEventListener(`click`, this._popupFavoriteClickHandler);
  }

  static parseCardToData(card) {
    return Object.assign(
        {},
        card,
        {
          newComment: {
            text: null,
            emoji: null,
            author: null,
            date: null,
            checkedEmojiId: null,
          }
        }
    );
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null; // Чтобы окончательно "убить" ссылку на prevElement

    this.restoreHandlers();
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, this._popupEmojiClickHandler);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._commentInputHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setPopupCloseButtonHandler(this._callback.popupCloseButtonHandler);
    this.setPopupWatchlistClickHandler(this._callback.popupWatchlistClickHandler);
    this.setPopupHistoryClickHandler(this._callback.popupHistoryClickHandler);
    this.setPopupFavoriteClickHandler(this._callback.popupFavoriteClickHandler);
  }
}
