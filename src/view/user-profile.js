import AbstractView from './abstract.js';

const createUserProfileTemplate = (activeRank) => {

  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${activeRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
  );
};

export default class UserProfile extends AbstractView {
  constructor(activeRank) {
    super();
    this._activeRank = activeRank;
  }

  _getTemplate() {
    return createUserProfileTemplate(this._activeRank);
  }
}
