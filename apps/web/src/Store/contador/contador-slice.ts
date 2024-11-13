// contadorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContadorState {
  [key: string]: number;
}

const initialState: ContadorState = {
  '1000': 0,
  '500': 0,
  '200': 0,
  '100': 0,
  '50': 0,
  '20': 0,
  '10': 0,
  '5': 0,
  '2': 0,
  '1': 0,
  '0.5': 0,
};

const contadorSlice = createSlice({
  name: 'contador',
  initialState,
  reducers: {
    setNota(state, action: PayloadAction<{ denomination: keyof ContadorState; amount: number }>) {
      const { denomination, amount } = action.payload;
      state[denomination] = amount;
    },
  },
});

export const { setNota } = contadorSlice.actions;
export { contadorSlice };
