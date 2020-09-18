import moment from "moment";

export const countWatchedFilms = (filmCards) => {
  return (filmCards.length !== 0) ? filmCards.filter((card) => card.isWatched) : 0;
};

export const countDuration = (filmCards) => {
  const totalDuration = filmCards.reduce((acc, current) => acc + current.duration, 0);
  const momentTotal = moment.duration(totalDuration, `minutes`);

  return {
    hours: momentTotal.hours(),
    minutes: momentTotal.minutes(),
  };
};

export const findTopGenre = (filmCards) => {
  if (filmCards.length === 0) {
    return ``;
  }

  const totalGenres = filmCards.reduce((acc, current) => [...acc, ...current.genres], []);
  const uniqueGenres = [...new Set(totalGenres)];

  const genresMap = {};
  uniqueGenres.forEach((uniqueGenre) => {
    genresMap[uniqueGenre] = totalGenres.filter((genre) => genre === uniqueGenre).length;
  });

  return Object.entries(genresMap).sort((a, b) => b[1] - a[1]);
};

export const filterByPeriod = (filmCards, period) => {
  const periodToFilterMap = {
    [`all-time`]: (cards) => cards,
    [`today`]: (cards) => cards.filter((card) => moment(card.watchingDate).isBetween(moment().startOf(`day`), moment().endOf(`day`))),
    [`week`]: (cards) => cards.filter((card) => moment(card.watchingDate).isBetween(moment().startOf(`week`), moment().endOf(`week`))),
    [`month`]: (cards) => cards.filter((card) => moment(card.watchingDate).isBetween(moment().startOf(`month`), moment().endOf(`month`))),
    [`year`]: (cards) => cards.filter((card) => moment(card.watchingDate).isBetween(moment().startOf(`year`), moment().endOf(`year`)))
  };

  if (filmCards) {
    return periodToFilterMap[period](filmCards);
  }

};

export const countWatchedInPeriod = (data) => {
  const period = data.period;
  const watchedFilms = countWatchedFilms(data.cards);

  // Return array of cards watched in specific period or empty array if nothing has been find
  return filterByPeriod(watchedFilms, period);
};
