import Observer from '../utils/observer.js';

export default class Movies extends Observer {
  constructor() {
    super();
    this._filmCards = [];
  }

  setFilmCards(filmCards) {
    this._filmCards = filmCards.slice();
  }

  getFilmCards() {
    return this._filmCards.slice();
  }

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
  }

  static adaptToClient(card) {
    const adaptedCard = Object.assign(
        {},
        card,
        {
          poster: card.film_info.poster,
          title: card.film_info.title,
          rating: card.film_info.total_rating,
          release:
            (card.film_info.release.date)
              ? new Date(card.film_info.release.date)
              : card.film_info.release.date,
          duration: card.film_info.runtime,
          description: card.film_info.description,
          original: card.film_info.title,
          writers: card.film_info.writers,
          actors: card.film_info.actors,
          country: card.film_info.release.release_country,
          director: card.film_info.director,
          genres: card.film_info.genre,
          ageRating: card.film_info.age_rating,
          isWatched: card.user_details.already_watched,
          isFavorite: card.user_details.favorite,
          isListed: card.user_details.watchlist,
          watchingDate:
            (card.user_details.watching_date)
              ? new Date(card.user_details.watching_date)
              : card.watching_date,
        }
    );

    // Remove unused keys
    delete adaptedCard.film_info;
    delete adaptedCard.user_details;

    return adaptedCard;
  }

  static adaptCommentsToClient(commentsArray) {
    const adaptedCommentsArray = commentsArray.map((commentObject) => {
      const adaptedComment = Object.assign(
          {},
          commentObject,
          {
            text: commentObject.comment,
            emoji: commentObject.emotion
          }
      );

      delete adaptedComment.comment;
      delete adaptedComment.emotion;

      return adaptedComment;
    });

    return adaptedCommentsArray;
  }

  static adaptCardToServer(card) {
    const adaptedCard = Object.assign(
        {},
        {
          comments: card[0].comments[0].id
        }
    );

    return adaptedCard;
  }
}
