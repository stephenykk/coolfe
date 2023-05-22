const calDate = (baseYear, yearCount) => {
  const date = new Date();
  date.setFullYear(baseYear);
  date.setMonth(0);
  date.setDate(1);

  const days = yearCount * 365;
  const oneDay = 24 * 60 * 60 * 1000;
  return new Date(date.getTime() + days * oneDay);
};

const log = (...args) => console.log(...args)

log(calDate(2020, 0.5))