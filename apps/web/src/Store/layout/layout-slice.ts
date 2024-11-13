import { createSlice } from '@reduxjs/toolkit';
import { linksGestao } from '../../Layout/Links';

export const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    theme: {
      colorScene: 'light',
    },
    navbar: {
      opened: false,
      activeTab: 'Gestão',
      activeLinks: linksGestao,
    },
    drawer: {
      opened: false,
    },
    caixa: {
      isCaixaLoading: false,
      isCodigoPedidoOpened: false,
    },
  },
  reducers: {
    //NavBar
    toggleNavBar(state) {
      state.navbar.opened = !state.navbar.opened;
    },

    setActiveLinks(state, action) {
      state.navbar.activeLinks = action.payload;
    },

    //Title Bar
    setActiveTab(state, action) {
      state.navbar.activeTab = action.payload;
    },

    //Drawer
    toggleDrawer(state) {
      state.drawer.opened = !state.drawer.opened;
    },

    //caixa
    setIsCaixaLoading(state, { payload }) {
      state.caixa.isCaixaLoading = payload;
    },

    setisCodigoPedidoOpened(state, { payload }) {
      state.caixa.isCodigoPedidoOpened = payload;
    },
  },
});

export const layoutAction = layoutSlice.actions;
