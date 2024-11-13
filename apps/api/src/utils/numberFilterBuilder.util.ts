import { NumberFilterProps } from '../shared/@types';

export const buildNumberFilter = (props: NumberFilterProps) => {
  if (props.firstValue) {
    switch (props.condition) {
      case 'lte':
        return {
          lte: parseFloat(props.firstValue.toString()),
        };
      case 'gte':
        return {
          gte: parseFloat(props.firstValue.toString()),
        };
      case 'equals':
        return {
          equals: parseFloat(props.firstValue.toString()),
        };
      case 'between':
        return {
          gte: parseFloat(props.firstValue.toString()),
          lte: parseFloat(props.secondValue.toString()),
        };
      default:
        return {
          equals: parseFloat(props.firstValue.toString()),
        };
    }
  } else {
    return {};
  }
};
