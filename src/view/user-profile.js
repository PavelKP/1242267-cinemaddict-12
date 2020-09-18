import AbstractView from './abstract.js';
import {getUserRank} from '../utils/user-profile.js';

const createUserProfileTemplate = (filmCards, userProfileData) => {

  const userGradeName = getUserRank(filmCards, userProfileData);

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
