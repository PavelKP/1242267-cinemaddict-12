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

  static adaptCardToClient(card) {
    const adaptedCard = Object.assign(
        {},
        card,
        {
          poster: card.film_info.poster,
          title: card.film_info.title,
          altTitle: card.film_info.alternative_title,
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
  //  delete adaptedCard.comments;

    return adaptedCard;
  }

  static adaptCardToServer(card) {

    console.log(card);
    console.log(card.comments);
/*
    const foo = Object.assign(
      {},
      card
    );*/
    //console.log(foo);


   // const commentsIdArray = card.comments.map((comment) => comment.id);
    const adaptedCard = Object.assign(
        {},
        {
          id: card.comments/*
          comments: commentsIdArray,
          film_info: {
            title: card.title,
            alternative_title: card.altTitle,
            total_rating: card.rating,
            poster: card.poster,
            age_rating: card.ageRating,
            director: card.director,
            writers: card.writers,
            actors: card.actors,
            release: {
              date: card.release,
              release_country: card.country
            },
            runtime: card.duration,
            genre: card.genres,
            description: card.description
          },
          user_details: {
            watchlist: card.isListed,
            already_watched: card.isWatched,
            watching_date: card.watchingDate,
            favorite: card.isFavorite
          }*/
        }
    );
        //console.log(adaptedCard)
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
}
