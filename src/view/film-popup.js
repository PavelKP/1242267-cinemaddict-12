import {EMOJI_FILE_NAMES, UserAction} from '../const.js';
import {formatDate, formatDuration} from '../utils/film-cards.js';
import SmartView from './smart.js';
import he from 'he';

const SHAKE_ANIMATION_TIMEOUT = 600;

// Create comments template
const createCommentTemplate = (comments, deletedCommentId) => {
  // Iterate throw copy of array with comments
  // Destructure variables as parameters
  // Replace array element with template
  // Join array into string
  return comments.map(({id, text, emoji, author, date}) => {
    const commentDate = formatDate(date, `YYYY/MM/DD HH:mm`);
    const emojiTemplate = emoji ? `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="${emoji}"/>` : ``;
    const encodedText = he.encode(text);
    const deleteState = (deletedCommentId === id) ? `deleting...` : `delete`;
    const disabled = deletedCommentId ? `disabled` : ``;

    return (`
    <li class="film-details__comment" data-comment-id="${id}">
      <span class="film-details__comment-emoji">
        ${emojiTemplate}
      </span>
      <div>
        <p class="film-details__comment-text">${encodedText}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete" ${disabled}>${deleteState}</button>
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

const createFilmDescriptionInList = (filmCard) => {
  const {director, writers, actors, release, duration, country, genres} = filmCard;

  const writersList = writers.join(`, `);
  const actorsList = actors.join(`, `);
  const longReleaseDate = formatDate(release, `DD MMMM YYYY`);
  const formattedDuration = formatDuration(duration);
  const genresTitle = (genres.length > 1) ? `Genres` : `Genre`;
  const genresList = genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``);

  const termToDefinition = {
    'Director': director,
    'Writers': writersList,
    'Actors': actorsList,
    'Release Date': longReleaseDate,
    'Runtime': formattedDuration,
    'Country': country,
    [genresTitle]: genresList
  };

  return Object.entries(termToDefinition).map(([term, definition]) => {
    return (
      `<tr class="film-details__row">
        <td class="film-details__term">${term}</td>
        <td class="film-details__cell">${definition}</td>
      </tr>`
    );
  }).join(``);
};

const generateControls = (filmCard) => {
  const {isWatched, isFavorite, isListed} = filmCard;

  const controls = {
    'watchlist': {label: `Add to watchlist`, checked: (isListed ? `checked` : ``)},
    'watched': {label: `Already watched`, checked: (isWatched ? `checked` : ``)},
    'favorite': {label: `Add to favorites`, checked: (isFavorite ? `checked` : ``)}
  };

  return Object.entries(controls).map(([name, {label, checked}]) => {
    return (
      `
      <input type="checkbox" class="film-details__control-input visually-hidden" id="${name}" name="${name}" ${checked}>
      <label for="${name}" class="film-details__control-label film-details__control-label--${name}">${label}</label>
      `
    );
  }).join(``);
};

const createFilmDetails = (filmCard) => {

  const {title, rating, poster, description, comments, ageRating, original, newComment, isDisabled, deletedCommentId} = filmCard;

  const formattedRating = (rating.toString().length === 1) ? `${rating}.0` : rating;
  const commentsTemplate = createCommentTemplate(comments, deletedCommentId);
  const commentsAmount = comments.length;

  const newEmojiName = newComment.emoji;
  const newEmojiTemplate = newEmojiName ? `<img src="./images/emoji/${newEmojiName}.png" width="55" height="55" alt="${newEmojiName}"/>` : ``;
  const newCommentText = newComment.text ? decodeURIComponent(newComment.text) : ``;
  const disabled = isDisabled ? `disabled` : ``;

  return (
    `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="${title}">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${original}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${formattedRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            ${createFilmDescriptionInList(filmCard)}
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        ${generateControls(filmCard)}
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
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${disabled}>${newCommentText}</textarea>
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

export default class FilmDetails extends SmartView {
  constructor(card) {
    super();
    this._data = FilmDetails.parseCardToData(card);

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
    return createFilmDetails(this._data);
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
    this.getElement().querySelectorAll(`.film-details__comment`)
      .forEach((button) => button.addEventListener(`click`, this._commentDeleteHandler));
  }

  setCommentSendHandler(callback) {
    this._callback.commentSendHandler = callback;
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._commentSendHandler);
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

  reset(card) {
    this.updateData(
        FilmDetails.parseCardToData(card)
    );
  }

  shake(callback, actionType, deletedCommentId) {
    let targetElement;
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        targetElement = this.getElement().querySelector(`.film-details__new-comment`);
        break;
      case UserAction.DELETE_COMMENT:
        targetElement = this.getElement().querySelector(`li[data-comment-id="${deletedCommentId}"]`);
        break;
    }

    targetElement.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT}ms`;
    setTimeout(() => {
      targetElement.style.animation = ``;
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
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

    this.updateData({
      newComment: Object.assign(
          {},
          this._data.newComment,
          {text: evt.target.value}
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
          {
            date: new Date()
          }
      );
      this._callback.commentSendHandler(newComment);
    }
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `BUTTON`) {
      return;
    }
    this._callback.commentDeleteHandler(evt.currentTarget);
  }

  static parseCardToData(card) {
    return Object.assign(
        {},
        card,
        {
          newComment: {
            text: ``,
            emoji: null,
            date: null,
            cardId: card.id
          }
        },
        {
          isDisabled: false,
          deletedCommentId: null
        }
    );
  }
}
