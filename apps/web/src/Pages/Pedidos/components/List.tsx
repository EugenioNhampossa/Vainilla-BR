import { Button, Paper, PaperProps, TextInput, Tooltip } from '@mantine/core';
import {
  IconBarcode,
  IconExclamationCircle,
  IconHash,
  IconTag,
} from '@tabler/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useCategoriasData } from '../../../hooks/HandleCategoria/useCategoriaData';
import { useProdutosData } from '../../../hooks/HandleProduto/useProdutosData';
import { useDebouncedState } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from '../../../hooks/appStates';
import { pedidoSlice } from '../../../Store/pedido/pedido-slice';
import { layoutSlice } from '../../../Store/layout/layout-slice';
import { showNotification } from '@mantine/notifications';
import { ulid } from 'ulid';
import { currentHour } from '../../../utils/CurrentHour';
import { number } from 'yup';

export interface ProdListProps extends PaperProps {}
//TODO:Adicionar paginacao
const List = React.forwardRef<HTMLDivElement, ProdListProps>((props, ref) => {
  const [page, setPage] = useState({ prodPage: 1, categPage: 1 });
  const pedido = useAppSelector((state) => state.pedido);
  const [screen, setScreen] = useState('categ');
  const [search, setSearch] = useState({
    type: 'titulo',
    placeholder: 'Pesquise pelo Titulo',
  });
  const [filtro, setFiltro] = useDebouncedState(
    {
      codigo: '',
      titulo: '',
      id_categoria: '',
    },
    300,
  );
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const { data: categorias, isLoading: isLoadingCateg } = useCategoriasData({
    filter: {},
    page: page.categPage,
    perPage: 30,
  });

  const { data: produtos, isLoading: isLoadingProd } = useProdutosData({
    filter: filtro,
    page: page.prodPage,
    perPage: 50,
  });

  useEffect(() => {
    dispatch(
      layoutSlice.actions.setIsCaixaLoading(isLoadingCateg || isLoadingProd),
    );
  }, [isLoadingCateg, isLoadingProd]);

  const handleCategClick = (id: string) => {
    setFiltro({ ...filtro, id_categoria: id });
    setScreen('prod');
  };

  const handleProdClick = (titulo: string, preco: number, id: string) => {
    // if (!pedido.codigo) {
    //   dispatch(pedidoSlice.actions.setCodigo(`${data.length + 1}`));
    // }
    if (!pedido.bloqueado) {
      dispatch(
        pedidoSlice.actions.addItem({
          id: ulid(),
          id_produto: id,
          hora: currentHour(),
          preco: preco,
          titulo,
          dataCriacao: new Date(),
          quantidade: 1,
          desconto: 0,
          confirmado: false,
        }),
      );
    } else {
      showNotification({
        icon: <IconExclamationCircle />,
        message: 'Não se pode editar um pedido bloqueado',
      });
    }
  };

  const handleSearch = (value: string) => {
    setFiltro({
      codigo: '',
      titulo: '',
      id_categoria: '',
    });
    if (search.type == 'titulo') setFiltro({ ...filtro, titulo: value });
    if (search.type == 'codigo') setFiltro({ ...filtro, codigo: value });
    setScreen('prod');
  };

  const CategList = categorias?.data.data.map((categoria: any, index: any) => (
    <Paper
      key={categoria.id}
      withBorder
      onClick={() => handleCategClick(categoria.id)}
      className="rounded-none uppercase flex items-center justify-center hover:shadow-sm hover:cursor-pointer hover:bg-blue-50"
    >
      {categoria.titulo}
    </Paper>
  ));

  const ProdList = produtos?.data.data.map((produto: any, index: any) => (
    <Tooltip
      key={produto.id}
      label={`Adicionar ${produto.titulo}`}
      openDelay={400}
      onClick={() =>
        handleProdClick(produto.titulo, parseFloat(produto.preco), produto.id)
      }
    >
      <Paper
        withBorder
        className="rounded-none uppercase flex flex-col items-center justify-around hover:shadow-sm hover:cursor-pointer hover:bg-blue-50"
      >
        <div className="mt-5">{produto.titulo}</div>
        <div className="text-xs">{parseFloat(produto.preco).toFixed(2)}</div>
      </Paper>
    </Tooltip>
  ));

  return (
    <Paper ref={ref} {...props}>
      <Paper withBorder className="rounded-none h-[8%] grid grid-cols-5 ">
        <div className="grid grid-cols-3">
          <Button
            variant="subtle"
            color={search.type != 'titulo' ? 'gray' : 'blue'}
            className="w-full h-full rounded-none border border-solid border-gray-300 border-t-0 border-b-0 border-l-0"
            onClick={() =>
              setSearch({ type: 'titulo', placeholder: 'Pesquise pelo titulo' })
            }
          >
            <IconTag />
          </Button>
          <Button
            color={search.type != 'codigo' ? 'gray' : 'blue'}
            variant="subtle"
            className="w-full h-full rounded-none border border-solid border-gray-300 border-t-0 border-b-0 border-l-0"
            onClick={() =>
              setSearch({ type: 'codigo', placeholder: 'Pesquise pelo código' })
            }
          >
            <IconHash />
          </Button>
          <Button
            color={search.type != 'barras' ? 'gray' : 'blue'}
            variant="subtle"
            className="w-full h-full rounded-none border border-solid border-gray-300 border-t-0 border-b-0 border-l-0"
            onClick={() =>
              setSearch({
                type: 'barras',
                placeholder: 'Pesquise pelo código de barras',
              })
            }
          >
            <IconBarcode />
          </Button>
        </div>
        <div className="col-span-3 flex items-center px-3">
          <TextInput
            variant="unstyled"
            ref={inputRef}
            onChange={(e) => handleSearch(e.currentTarget.value)}
            placeholder={search.placeholder}
            className="w-full"
          />
        </div>
        <Button
          onClick={() => setScreen('categ')}
          variant="light"
          className="w-full h-full rounded-none "
        >
          Categorias
        </Button>
      </Paper>
      <div className="grid grid-cols-6 grid-rows-5 h-[92%] gap-1">
        {screen == 'categ' ? CategList : ProdList}
      </div>
    </Paper>
  );
});

List.displayName = 'ProdList';

export { List as ProdList };
