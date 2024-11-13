import {
  Button,
  Center,
  CloseButton,
  Divider,
  Paper,
  Text,
  TextInput,
} from '@mantine/core';
import { closeAllModals, openModal } from '@mantine/modals';
import {
  IconExclamationCircle,
  IconFilter,
  IconFilterOff,
  IconTrash,
  IconUserPlus,
  IconX,
} from '@tabler/icons';
import { useClientesData } from '../../../hooks/HandleCliente/useClientesData';
import { useState } from 'react';
import { Tabela } from '../../../Components/Tabela/Tabela';
import { useAppDispatch, useAppSelector } from '../../../hooks/appStates';
import { pedidoSlice } from '../../../Store/pedido/pedido-slice';
import { NovoCliente } from './NovoCliente';

export const Cliente = () => {
  const dispatch = useAppDispatch();
  const pedido = useAppSelector((state) => state.pedido);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(30);
  const [cliente, setCliente] = useState<any>(pedido.Cliente);
  const [nome, setNome] = useState('');
  const [nuit, setNuit] = useState('');
  const [email, setEmail] = useState('');

  const columns = [{ title: 'Nome', accessor: 'nome' }];

  const { data: clientes, isLoading } = useClientesData({
    filter: { nome, nuit, email },
    page,
    perPage,
  });

  const onFilterSubmit = (e: any) => {
    e.preventDefault();
    setNome(e.target.nome.value.trim());
    setNuit(e.target.nuit.value.trim());
    setPage(1);
  };

  const reset = () => {
    const form: any = document.getElementById('filterClientes');
    form.reset();
    setEmail('');
    setNome('');
    setNuit('');
  };

  const handleOkClick = () => {
    dispatch(
      pedidoSlice.actions.setCliente({
        id: cliente.id,
        nome: cliente.nome,
        nuit: cliente.nuit,
      }),
    );
    closeAllModals();
  };

  const handleRemover = () => {
    dispatch(pedidoSlice.actions.removeCliente());
    setCliente(undefined);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-xl">Pesquise o Cliente</div>
        <div className="flex items-center justify-between text-xl">
          <span>Cliente Seleccionado</span>
          <CloseButton onClick={() => closeAllModals()} />
        </div>
      </div>
      <div className="grid grid-cols-2 h-[79vh] gap-4">
        <Paper withBorder className="rounded-none p-2 space-y-2">
          <form
            id="filterClientes"
            onSubmit={(e) => onFilterSubmit(e)}
            className="space-y-2"
          >
            <TextInput
              name="nome"
              label="Nome"
              placeholder="Pesquise pelo nome"
            />
            <TextInput
              name="nuit"
              label="NUIT"
              placeholder="Pesquise pelo NUIT"
            />
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => reset()}
                compact
                leftIcon={<IconFilterOff />}
              >
                Limpar
              </Button>
              <Button type="submit" compact leftIcon={<IconFilter />}>
                Filtrar
              </Button>
            </div>
          </form>
          <Divider />
          <Tabela
            columns={columns}
            height={320}
            data={clientes?.data}
            isLoading={isLoading}
            page={page}
            onRowClick={setCliente}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
          />
        </Paper>
        <Paper withBorder className="rounded-none p-2 space-y-4">
          <Button
            leftIcon={<IconUserPlus />}
            onClick={() =>
              openModal({
                title: <Text size="lg">Novo Cliente</Text>,
                fullScreen: true,
                children: <NovoCliente />,
              })
            }
          >
            Adicionar Cliente
          </Button>
          {cliente ? (
            <>
              <div className="text-xl">{cliente.nome}</div>
              <div className="">NUIT: {cliente.nuit}</div>
              <Button
                className="mt-3"
                variant="default"
                leftIcon={<IconTrash />}
                onClick={() => handleRemover()}
              >
                Limpar cliente seleccionado
              </Button>
            </>
          ) : (
            <Center className="h-[80%] text-red-400 flex-col">
              <IconExclamationCircle size={150} />
              <div className="text-xl">Cliente não está seleccionado</div>
              <div>Seleccione um cliente da lista.</div>
            </Center>
          )}
        </Paper>
      </div>
      <div className="flex items-center justify-end gap-4">
        <Button
          size="lg"
          color="red"
          leftIcon={<IconX />}
          onClick={() => closeAllModals()}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => handleOkClick()}
          size="lg"
          color="green"
          leftIcon={<IconX />}
        >
          OK
        </Button>
      </div>
    </div>
  );
};
