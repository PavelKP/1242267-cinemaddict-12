import Observer from '../utils/observer.js';
import {getUserRank} from '../utils/user-profile.js';
import {userGradeSettings} from '../const.js';


export default class UserProfile extends Observer {
  constructor() {
    super();
    this._filmCards = null;
    this._currentRank = null;
  }

  setRank(updateType, rank) {
    this._activeRank = rank;
    this._notify(updateType, rank);
  }

  getRank() {
    return this._activeRank;
  }

  countRank(filmCards) {
    this._filmCards = filmCards.slice();
    this._activeRank = getUserRank(this._filmCards, userGradeSettings);
  }
/*
  updateFilmCard(updateType, update) {
    const index = this._filmCards.findIndex((card) => card.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film card`);
    }

    this._filmCards = [
      ...this._filmCards.slice(0, index),
      update,
      ...this._filmCards.slice(index + 1)
    ];

    this._notify(updateType, update);
  }*/
}
