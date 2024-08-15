import * as dayjs from 'dayjs';

// isPast:true -> 4주 전, false -> 4주 후
export const shiftDateByWeeks = (openDate: Date, isPast: boolean) => {
  return isPast
    ? new Date(dayjs(openDate).subtract(4, 'week').format('YYYY-MM-DD'))
    : new Date(dayjs(openDate).add(4, 'week').format('YYYY-MM-DD'));
};

export const getYesterdayDate = (date: Date) => {
  return new Date(dayjs(date).subtract(1, 'day').format('YYYY-MM-DD'));
};
