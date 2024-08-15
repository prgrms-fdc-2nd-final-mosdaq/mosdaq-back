import * as dayjs from 'dayjs';

export const get4WeeksPrevPriceByOpenDate = (openDate: Date) => {
  const fourWeeksAgo = dayjs(openDate).subtract(4, 'week');

  const dates = [];
  for (let i = 0; i < 7; i++) {
    dates.push(fourWeeksAgo.add(i, 'day').format('YYYY-MM-DD'));
  }

  return dates;
};
