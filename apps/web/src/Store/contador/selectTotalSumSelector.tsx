import { RootState } from "..";
import { createSelector } from "@reduxjs/toolkit";

export const selectTotalSum = createSelector(
  (state: RootState) => state.contador,
  (contador) => {
    return Object.entries(contador).filter(([key]) => key !== 'POS').reduce<number>((sum, [key, value]) => {
      const denomination = parseFloat(key);
      return sum + denomination * value;
    }, 0);
  }
);

// export const selectAllBankNotes = createSelector((state: RootState) => state.contador, )