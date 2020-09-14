import moment from "moment";

// Convert date to year only
const formatYear = (dateObject) => {
  return dateObject.getFullYear();
};

// Shorten string to limit -1
const shortenString = (string, limit) => {
  return (string.length > limit) ? `${string.slice(0, limit - 1).trim()}…` : string;
};

// Remove extension
const removeExtension = (string) => {
  // Dot, any symbol one ore more times, end of word
  // Brackets are necessary
  return string.replace(/\.(.+)$/g, ``);
};

const sortByDate = (a, b) => {
  return b.release.getTime() - a.release.getTime();
};

const sortByRating = (a, b) => {
  return b.rating - a.rating;
};

const formatDate = (date, format) => {
  if (!(date instanceof Date)) {
    return ``;
  }
  return moment(date).format(format);
};

const formatDuration = (duration) => {
  const momentDuration = moment.duration(duration, `minutes`);
  const durationHours = (momentDuration.hours() <= 0) ? `` : `${momentDuration.hours()}h`;
  const durationMinutes = (momentDuration.minutes() <= 0) ? `` : `${momentDuration.minutes()}m`;

  return `${durationHours} ${durationMinutes}`;
};

export {formatYear, removeExtension, shortenString, sortByDate, sortByRating, formatDate, formatDuration};
