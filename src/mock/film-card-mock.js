import {getRandomInteger, generateTextFromArray, getRandomElementsFromArray,
  getRandomFromArray} from '../utils/common.js';

const FILM_NAMES = [`The Dance of Life`, `Sagebrush Trail`, `The Man with the Golden Arm`, `Santa Claus Conquers the Martians`, `Popeye the Sailor Meets Sindbad the Sailor`];
const DESCRIPTION_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const DESCRIPTION_SENTENCE_MIN_MAX = [1, 5];
const POSTER_FILES = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const COMMENTS = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`];
const COMMENTS_AMOUNT = [0, 5];
const EMOJI = [`angry.png`, `puke.png`, `sleeping.png`, `smile.png`];
const AUTHORS = [`Tim Macoveev`, `John Doe`, `Pushkin A.`];
const DURATION_RANGE = [15, 120];
const GENRES = [`Drama`, `Film-Noir`, `Mystery`, `Comedy`, `Cartoon`, `Western`, `Horror`];
const DIRECTORS = [`Anthony Mann`, `Quentin Tarantino`, `Vasya Ivanov`, `Petya Petrov`, `Jackiy Chan`];
const ORIGINALS = [`The Great Flamarion`, `Snatch`, `Lock, Stock and Two Smoking Barrels`, `Sherlock Holmes`, `Spiderman 9: reborn`];
const WRITERS = [`Anne Wigton`, `Heinz Herald`, `Richard Weil`, `Lev Tolstoi`, `Vasya Lojkin`];
const ACTORS = [`Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`, `Alexander Petrov`, `Misha Galustyan`];
const COUNTRIES = [`USA`, `Germany`, `Russia`, `Ukraine`, `Uzbekistan`, `Belorussia`];
const AGE_RATING = [`18+`, `16+`, `6+`, `13+`];

// Generate random date
const generateRandomDate = (maxYearGap = 0) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const currentHours = currentDate.getHours();

  // Count previous year or remain current
  // Change year in currentDate object
  // Create variable with changed year
  const yearGap = getRandomInteger(-maxYearGap, 0);
  currentDate.setFullYear(currentDate.getFullYear() + yearGap);
  const year = currentDate.getFullYear();

  // If current year equal now year, count any previous month within this year
  // Change month in currentDate object
  const month = (currentYear === year) ? getRandomInteger(0, currentDate.getMonth()) : getRandomInteger(0, 11);
  currentDate.setMonth(month);

  let day;
  if (currentYear === year && month === currentMonth) { // this year and this month
    day = getRandomInteger(0, currentDate.getDate());
  } else {
    const daysInMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    day = getRandomInteger(0, daysInMonths[month]);
  }
  currentDate.setDate(day); // Change day in currentDate object

  const hours = (currentYear === year && month === currentMonth && day === currentDay)
    ? getRandomInteger(0, currentDate.getHours())
    : getRandomInteger(0, 24);

  currentDate.setHours(hours); // Change hours in currentDate object

  const minutes = (currentYear === year && month === currentMonth && day === currentDay && hours === currentHours)
    ? getRandomInteger(0, currentDate.getMinutes())
    : getRandomInteger(0, 60);

  currentDate.setMinutes(minutes);

  return new Date(currentDate);
};

// Generate comments
const generateComments = () => {
  // Create empty array
  // Fill array with comment objects
  const comments = new Array(getRandomInteger(...COMMENTS_AMOUNT)).fill();
  comments.forEach((element, i) => {

    // Generate random comment data
    const text = getRandomFromArray(COMMENTS);
    const emoji = getRandomFromArray(EMOJI);
    const author = getRandomFromArray(AUTHORS);
    const date = generateRandomDate();

    comments[i] = {
      text,
      emoji,
      author,
      date,
    };
  });

  return comments;
};

// Generate film ratings array
const generateFilmRating = () => {
  const integer = getRandomInteger(1, 10);
  const fractional = (integer < 10) ? getRandomInteger(0, 9) : 0;
  return `${integer}.${fractional}`;
};

// Convert text to separate sentences
const descriptionArray = DESCRIPTION_TEXT.match(/[A-Z][\w\s,]+\./g);

export const generateFilmCard = () => {
  const poster = getRandomFromArray(POSTER_FILES);
  const title = getRandomFromArray(FILM_NAMES);
  const rating = generateFilmRating();
  const release = generateRandomDate(70);
  const duration = getRandomInteger(...DURATION_RANGE);
  const description = generateTextFromArray(descriptionArray, DESCRIPTION_SENTENCE_MIN_MAX);
  const comments = generateComments();
  const original = getRandomFromArray(ORIGINALS);
  const writers = getRandomElementsFromArray(WRITERS, getRandomInteger(1, 3));
  const actors = getRandomElementsFromArray(ACTORS, getRandomInteger(1, 3));
  const country = getRandomFromArray(COUNTRIES);
  const director = getRandomFromArray(DIRECTORS);
  const genres = getRandomElementsFromArray(GENRES, getRandomInteger(1, 3));
  const ageRating = getRandomFromArray(AGE_RATING);
  const isWatched = Boolean(getRandomInteger(0, 1));
  const isFavorite = Boolean(getRandomInteger(0, 1));
  const isListed = Boolean(getRandomInteger(0, 1));

  return {
    poster,
    title,
    rating,
    release,
    duration,
    description,
    comments,
    original,
    writers,
    actors,
    country,
    director,
    genres,
    ageRating,
    isWatched,
    isFavorite,
    isListed,
  };
};
