export const DESCRIPTION_LIMIT = 140;
export const EMOJI_FILE_NAMES = [`smile`, `sleeping`, `puke`, `angry`];
export const FILM_CARD_AMOUNT_PER_STEP = 5;

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export const UserAction = {
  UPDATE_FILM_CARD: `UPDATE_FILM_CARD`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export const userGradeSettings = {
  'Novice': {min: 1, max: 10},
  'Fan': {min: 11, max: 20},
  'Movie buff': {min: 21, max: Infinity}
};
