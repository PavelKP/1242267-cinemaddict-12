import AbstractView from './abstract.js';

const createUserProfileTemplate = (filmCards, userProfileData) => {
  // Cards with watched flag
  const watchedFilmsAmount = filmCards.filter((el) => el.isWatched).length;
  // User profile grade name by default
  let userGradeName = ``;

  if (watchedFilmsAmount > 0) {

    for (const grade in userProfileData) {
      if (userProfileData.hasOwnProperty(grade)) {
        const minFilms = userProfileData[grade].min;
        const maxFilms = userProfileData[grade].max;
        userGradeName = (watchedFilmsAmount >= minFilms && watchedFilmsAmount <= maxFilms) ? grade : false;

        if (userGradeName) {
          break; // If user name is find, break cycle
        }
      }
    }
  }

  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${userGradeName}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
  );
};

export default class UserProfile extends AbstractView {
  constructor(filmCards, userProfileData) {
    super();
    this._filmCards = filmCards;
    this._userProfileData = userProfileData;
  }

  _getTemplate() {
    return createUserProfileTemplate(this._filmCards, this._userProfileData);
  }
}
