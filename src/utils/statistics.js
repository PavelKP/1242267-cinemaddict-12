import moment from "moment";

export const countWatchedFilms = (filmCards) => {
  return filmCards.filter((card) => card.isWatched);
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
  const totalGenres = filmCards.reduce((acc, current) => [...acc, ...current.genres], []);
  const uniqueGenres = [...new Set(totalGenres)];

  const genresMap = {};
  uniqueGenres.forEach((uniqueGenre) => {
    genresMap[uniqueGenre] = totalGenres.filter((genre) => genre === uniqueGenre).length;
  });

  return Object.entries(genresMap).sort((a, b) => b[1] - a[1])[0][0];
};
