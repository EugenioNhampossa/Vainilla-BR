import { createSlice } from '@reduxjs/toolkit';

export const artigosSlice = createSlice({
  name: 'artigo',
  initialState: {
    selected_artigos: [],
    selected_products: [],
  },
  reducers: {
    setSelectedArtigos(state, action) {
      state.selected_artigos = action.payload;
    },
    setSelectedProducts(state, action) {
      state.selected_products = action.payload;
    },
  },
});

export const artigoActions = artigosSlice.actions;
