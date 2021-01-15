const methods = {
  capitalize: (string) =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase(),
  extractAverageVote: (filmsRating) => {
    if (filmsRating.length > 0) {
      const totalVotes = filmsRating.length;
      const sumVotes = filmsRating.reduce(
        (acumulator, currentValue) => acumulator + currentValue.vote,
        0
      );

      const average = sumVotes / totalVotes;

      return average;
    }
    return 0;
  },
};

module.exports = methods;
