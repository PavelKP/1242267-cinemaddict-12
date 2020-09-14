import {EMOJI_FILE_NAMES} from '../const.js';
import {generateId} from '../utils/common.js';
import {formatDate, formatDuration} from '../utils/film-cards.js';
import SmartView from './smart.js';

// Create comments template
const createCommentTemplate = (commentsArray) => {

  // Iterate throw copy of array with comments
  // Destructure variables as parameters
  // Replace array element with template
  // Join array into string
  return commentsArray.map(({id, text, emoji, author, date}) => {
    const commentDate = formatDate(date, `YYYY/MM/DD HH:mm`);
    const emojiTemplate = emoji ? `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="${emoji}"/>` : ``;
    const decodedText = decodeURIComponent(text);

    return (`
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        ${emojiTemplate}
      </span>
      <div>
        <p class="film-details__comment-text">${decodedText}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete" data-comment-id = "${id}">Delete</button>
        </p>
      </div>
    </li>
    `);

  }).join(``);
};

const createEmojiList = (fileNames, currentEmojiName) => {

  return fileNames.map((fileName) => {

    const checked = (fileName === currentEmojiName) ? `checked` : ``;

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
  const longReleaseDate = formatDate(release, `DD MMMM YYYY`);
  const formattedDuration = formatDuration(duration);

  const genresTitle = (genres.length > 1) ? `Genres` : `Genre`;
  const genresList = genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``);

  const isListedChecked = isListed ? `checked` : ``;
  const watchedChecked = isWatched ? `checked` : ``;
  const isFavoriteChecked = isFavorite ? `checked` : ``;

  const commentsTemplate = createCommentTemplate(comments);
  const commentsAmount = comments.length;

  const newEmojiName = newComment.emoji;
  const newEmojiTemplate = newEmojiName ? `<img src="./images/emoji/${newEmojiName}.png" width="55" height="55" alt="${newEmojiName}"/>` : ``;
  const newCommentText = newComment.text ? decodeURIComponent(newComment.text) : ``;

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
          <div class="film-details__add-emoji-label">
            ${newEmojiTemplate}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newCommentText}</textarea>
          </label>

          <div class="film-details__emoji-list">
          ${createEmojiList(EMOJI_FILE_NAMES, newEmojiName)}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`
  );
};

export default class FilmDetailsPopup extends SmartView {
  constructor(card) {
    super();
    this._data = FilmDetailsPopup.parseCardToData(card);

    this._popupCloseButtonHandler = this._popupCloseButtonHandler.bind(this);
    this._popupWatchlistClickHandler = this._popupWatchlistClickHandler.bind(this);
    this._popupHistoryClickHandler = this._popupHistoryClickHandler.bind(this);
    this._popupFavoriteClickHandler = this._popupFavoriteClickHandler.bind(this);

    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._emojiInputChangeHandler = this._emojiInputChangeHandler.bind(this);
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
    this._commentSendHandler = this._commentSendHandler.bind(this);

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

  _commentInputHandler(evt) {
    evt.preventDefault();
    const encodedText = encodeURIComponent(evt.target.value);

    this.updateData({
      newComment: Object.assign(
          {},
          this._data.newComment,
          {text: encodedText}
      )
    }, true);
  }

  _emojiInputChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    const currentEmojiFileName = evt.target.value;

    this.updateData({
      newComment: Object.assign(
          {},
          this._data.newComment,
          {emoji: currentEmojiFileName}
      )
    });
  }

  _commentSendHandler(evt) {
    if (evt.ctrlKey && evt.key === `Enter`) {
      const newComment = Object.assign(
          {},
          this._data.newComment,
          {id: generateId(),
            author: `Anonymous`,
            date: new Date()}
      );

      this._callback.commentSendHandler(newComment);
    }
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();
    this._callback.commentDeleteHandler(evt.target);
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

  setCommentDeleteHandler(callback) {
    this._callback.commentDeleteHandler = callback;
    this.getElement().querySelectorAll(`.film-details__comment-delete`)
      .forEach((button) => button.addEventListener(`click`, this._commentDeleteHandler));
  }

  setCommentSendHandler(callback) {
    this._callback.commentSendHandler = callback;
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._commentSendHandler);
  }

  static parseCardToData(card) {
    return Object.assign(
        {},
        card,
        {
          newComment: {
            id: null,
            text: ``,
            emoji: null,
            author: null,
            date: null,
          }
        }
    );
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiInputChangeHandler);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._commentInputHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setPopupCloseButtonHandler(this._callback.popupCloseButtonHandler);
    this.setPopupWatchlistClickHandler(this._callback.popupWatchlistClickHandler);
    this.setPopupHistoryClickHandler(this._callback.popupHistoryClickHandler);
    this.setPopupFavoriteClickHandler(this._callback.popupFavoriteClickHandler);
    this.setCommentDeleteHandler(this._callback.commentDeleteHandler);
    this.setCommentSendHandler(this._callback.commentSendHandler);
  }
}
