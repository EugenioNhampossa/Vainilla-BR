import { configureStore } from '@reduxjs/toolkit';
import { artigosSlice } from './artigos/artigos-slice';
import { layoutSlice } from './layout/layout-slice';
import { userSlice } from './user/user-slice';
import { pedidoSlice } from './pedido/pedido-slice';
import { contadorSlice } from './contador/contador-slice';

export const store = configureStore({
  reducer: {
    layout: layoutSlice.reducer,
    user: userSlice.reducer,
    artigo: artigosSlice.reducer,
    pedido: pedidoSlice.reducer,
    contador: contadorSlice.reducer
  },
});
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
