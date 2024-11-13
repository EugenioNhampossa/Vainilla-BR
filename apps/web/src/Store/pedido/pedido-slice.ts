import { createSlice } from '@reduxjs/toolkit';
import { ulid } from 'ulid';
import { gerarCodigoUnico } from '../../utils/UniqueCode';

export interface BillItem {
  id: string;
  id_produto: string;
  hora?: string;
  titulo: string;
  quantidade: number;
  dataCriacao: Date;
  preco: number;
  desconto: number;
  confirmado: boolean;
}

export interface Cliente {
  id: string;
  nome: string;
  nuit: string;
}

export interface Pedido {
  id: string;
  codigo: string;
  estado: 'EM_ESPERA' | 'EM_PROCESSO' | 'COMPLETO';
  desconto: number;
  bloqueado: boolean;
  Cliente?: Cliente;
  ItemPedido: BillItem[];
  selected?: BillItem | undefined;
}

const initialState: Pedido = {
  id: ulid(),
  estado: 'EM_ESPERA',
  codigo: gerarCodigoUnico(),
  ItemPedido: [],
  bloqueado: false,
  desconto: 0,
};

export const pedidoSlice = createSlice({
  name: 'pedido',
  initialState,
  reducers: {
    clear(state) {
      return { ...initialState, id: ulid() };
    },
    setPedido(state, { payload }: { payload: Pedido }) {
      return payload;
    },
    setCodigo(state, { payload }) {
      state.codigo = payload;
    },
    setEstado(state, { payload }) {
      state.estado = payload;
    },
    setBloqueado(state, { payload }: { payload: boolean }) {
      state.bloqueado = payload;
    },
    setCliente(state, { payload }: { payload: Cliente; type: any }) {
      state.Cliente = payload;
    },
    removeCliente(state) {
      state.Cliente = undefined;
    },
    addItem(state, { payload }: { payload: BillItem; type: any }) {
      const index = state.ItemPedido.findIndex(
        (value) => value.id_produto == payload.id_produto && !value.confirmado,
      );
      if (index < 0) {
        state.ItemPedido.push(payload);
      } else {
        if (!state.ItemPedido[index].confirmado) {
          state.ItemPedido[index].quantidade += 1;
        } else {
          state.ItemPedido.push(payload);
        }
      }
    },
    selectItem(state, { payload }: { payload: BillItem; type: any }) {
      state.selected = payload;
    },
    // confirmItems(state) {
    //   const newItems = state.ItemPedido.map((item) => ({
    //     ...item,
    //     confirmado: true,
    //   }));
    //   state.ItemPedido = newItems;
    // },
    removeItem(state) {
      state.ItemPedido = state.ItemPedido.filter(
        (value) => state.selected?.id != value.id,
      );
      state.selected = undefined;
    },
    removeItemSelected(state) {
      state.selected = undefined;
    },
    setQty(state, { payload }) {
      const index = state.ItemPedido.findIndex(
        (value) => value.id == state.selected?.id,
      );
      if (state.selected) {
        state.selected.quantidade = payload;
      }
      state.ItemPedido[index].quantidade = payload;
    },
    setDesconto(state, { payload }) {
      state.desconto = payload;
    },
    clearDesconto(state) {
      state.desconto = 0;
      state.ItemPedido.map((item) => {
        item.desconto = 0;
      });
      if (state.selected) {
        state.selected.desconto = 0;
      }
    },
    setItemDesconto(state, { payload }) {
      const index = state.ItemPedido.findIndex(
        (value) => value.id == state.selected?.id,
      );
      if (state.selected) {
        state.selected.desconto = payload;
      }
      state.ItemPedido[index].desconto = payload;
    },
  },
});

export const pedidoActions = pedidoSlice.actions;
