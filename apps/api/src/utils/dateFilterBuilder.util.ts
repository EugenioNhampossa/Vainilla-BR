import { DateFilterProps } from '../shared/@types';

export const buildDateFilter = (props: DateFilterProps) => {
  if (props.firstDate) {
    switch (props.condition) {
      case 'lte':
        return {
          lte: new Date(props.firstDate),
        };
      case 'gte':
        return {
          gte: new Date(props.firstDate),
        };
      case 'equals':
        return {
          equals: new Date(props.firstDate),
        };
      case 'between':
        return {
          gte: new Date(props.firstDate),
          lte: new Date(props.secondDate),
        };
      default:
        return {
          equals: new Date(props.firstDate),
        };
    }
  } else {
    return {};
  }
};

export function formatDate(data?: string | Date) {
  const iso = new Date(data || new Date());
  iso.setHours(0, 0, 0, 0);
  return iso.toISOString();
}

export function getNextDate(date?: Date) {
  const nextDate = new Date(formatDate(date));
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate;
}
export function getPreviousDate(date?: Date) {
  const previousDate = new Date(formatDate(date));
  previousDate.setDate(previousDate.getDate() - 1);
  return previousDate;
}
