import { IconLock, IconLockOpen, IconLogout, IconX } from '@tabler/icons';
import {
  Group,
  Avatar,
  Text,
  UnstyledButton,
  MediaQuery,
  Box,
  Divider,
  createStyles,
  Loader,
  Stack,
  Button,
  ActionIcon,
  Badge,
  NumberInput,
  Grid,
} from '@mantine/core';
import { useDispatch } from 'react-redux';
import { AsideDrawer } from './AsideDrawer';
import { layoutAction } from '../Store/layout/layout-slice';
import {
  closeAllModals,
  openConfirmModal,
  openModal,
  useModals,
} from '@mantine/modals';
import { useAuth0 } from '@auth0/auth0-react';
import { useGetCaixa } from '../hooks/HandleCaixa/useGetCaixaByUser';
import { useOpenSession } from '../hooks/HandleCaixa/useUpdateCaixa';
import { notify } from './Modals/Notification';
import { useEffect, useState } from 'react';
import Contador from './BankNoteCounter';
import { SumOfTotal } from './SumOfTotals';
import { SessionClosureComputedValues } from './SessionClosureComputedValues';
import { useGetTotalValuesPerSession } from '../hooks/HandlePedido/usePedidoData';

const useStyles = createStyles((theme) => ({
  linkButton: {
    borderRadius: theme.radius.sm,
    margin: `${theme.spacing.xs}px 0`,
  },
}));

export function MenuCaixa() {
  const dispatch = useDispatch();
  const [saldoInical, setSaldoInicial] = useState(0);
  const modals = useModals();
  const { isLoading, logout, user } = useAuth0();

  const handleLogoutClick = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const { data: caixa, refetch } = useGetCaixa(user?.email);
  const { data: valores, refetch: refetchValues } = useGetTotalValuesPerSession(
    {
      id_sessao: caixa?.data.id_sessao,
    },
  );

  const { mutate: openSession, isLoading: isOpening } = useOpenSession();

  useEffect(() => {
    refetchValues();
  }, [modals]);

  const handleOpen = () => {
    openModal({
      color: 'green',
      title: (
        <Text size="sm" fw="bold">
          Abertura do caixa
        </Text>
      ),
      children: (
        <Stack>
          <NumberInput
            label="Saldo inicial"
            description="O valor usado para criar trocos"
            variant="filled"
            placeholder="Insira o saldo inicial"
            value={saldoInical}
            min={0}
            precision={2}
            onChange={(value) => setSaldoInicial(value || 0)}
          />
          <Group position="right">
            <Button
              color="red"
              variant="light"
              onClick={() => closeAllModals()}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                openSession(
                  { valor_entrada: saldoInical, id_caixa: caixa?.data.id },
                  {
                    onSuccess: () => {
                      notify({
                        message: 'Caixa aberto',
                        title: 'Sucesso',
                        type: 'success',
                      });
                      refetch();
                      closeAllModals();
                    },
                  },
                );
              }}
              loading={isOpening}
            >
              Abrir Caixa
            </Button>
          </Group>
        </Stack>
      ),
    });
  };

  const handleClose = () => {
    openModal({
      fullScreen: true,
      withCloseButton: true,
      title: (
        <Text size="xl" fw="bold">
          Encerramento do caixa
        </Text>
      ),
      children: (
        <>
          <Grid gutter="xs" justify="space-between">
            {/* Computed Values */}
            <Grid.Col span={4}>
              <SessionClosureComputedValues
                total={valores?.data.total}
                totalPOS={valores?.data.totalPOS}
              />
            </Grid.Col>
            <Divider orientation="vertical" />
            <Grid.Col span={7}>
              <Stack>
                <Text>Dados do Usuario</Text>
                {/* Notas */}
                <Grid>
                  {/* Notas de 1000 */}
                  <Contador label="Notas" valorDaNota={1000} />
                  {/* Notas de 500 */}
                  <Contador label="Notas" valorDaNota={500} />
                </Grid>
                <Grid>
                  {/* Notas de 200 */}
                  <Contador label="Notas" valorDaNota={200} />
                  {/* Notas de 100 */}
                  <Contador label="Notas" valorDaNota={100} />
                </Grid>
                <Grid>
                  {/* Notas de 50 */}
                  <Contador label="Notas" valorDaNota={50} />
                  {/* Notas de 20 */}
                  <Contador valorDaNota={20} label="Notas" />
                </Grid>
                <Divider />
                {/* Moedas */}
                <Grid>
                  {/* Moedas de 10 */}
                  <Contador valorDaNota={10} label="Moedas" />
                  {/* Moedas de 5 */}
                  <Contador valorDaNota={5} label="Moedas" />
                </Grid>
                <Grid>
                  {/* Moedas de 2 */}
                  <Contador valorDaNota={2} label="Moedas" />
                  {/* Moedas de 1 */}
                  <Contador valorDaNota={1} label="Moedas" />
                </Grid>
                <Grid>
                  {/* Moedas de .5 */}
                  <Contador valorDaNota={0.5} label="Moedas" />
                </Grid>

                <Divider />
                <SumOfTotal
                  refetch={refetch}
                  totalVendas={valores?.data.total}
                  totalPOS={valores?.data.totalPOS}
                  caixaId={caixa?.data.id}
                  sessionId={caixa?.data.id_sessao}
                />
              </Stack>
            </Grid.Col>
          </Grid>
        </>
      ),
    });
  };

  const Drawer = (
    <AsideDrawer>
      <Group position="apart" w="100%">
        <Group>
          <Avatar size={40} color="red" src={user?.picture} />
          {isLoading ? (
            <Loader size="sm" variant="dots" />
          ) : (
            <div>
              <Text size="md"> {user?.name}</Text>
              <Text size="sm" color="dimmed">
                {user?.email}
              </Text>
            </div>
          )}
        </Group>
        <ActionIcon onClick={() => dispatch(layoutAction.toggleDrawer())}>
          <IconX />
        </ActionIcon>
      </Group>
      <Divider my="md" />
      <Box mt="lg">
        <Stack>
          <Box>
            <div className="text-xs text-gray-400">Instalação</div>
            <div className="text-sm">{caixa?.data.Instalacao.titulo}</div>
          </Box>
          {caixa?.data && (
            <Stack>
              <Box>
                <Group
                  position="apart"
                  align="center"
                  className="text-xs text-gray-400"
                >
                  <div>Caixa</div>
                  {caixa?.data.is_open && (
                    <Badge color="green" radius="xs">
                      Aberto
                    </Badge>
                  )}
                  {!caixa?.data.is_open && (
                    <Badge color="red" radius="xs">
                      Fechado
                    </Badge>
                  )}
                </Group>
                <div className="text-sm">{caixa?.data.codigo}</div>
              </Box>
              {caixa?.data.is_open && (
                <Button
                  fullWidth
                  color="orange"
                  leftIcon={<IconLock size={18} />}
                  onClick={handleClose}
                >
                  Fechar caixa
                </Button>
              )}
              {!caixa?.data.is_open && (
                <Button
                  fullWidth
                  color="green"
                  leftIcon={<IconLockOpen size={18} />}
                  onClick={handleOpen}
                >
                  Abrir caixa
                </Button>
              )}
            </Stack>
          )}
        </Stack>
        <Divider my="md" />
        <Button
          color="red"
          variant="filled"
          onClick={() =>
            openConfirmModal({
              title: 'Confirme o logout',
              color: 'red',
              children: (
                <>
                  <Stack>
                    <Text fw="bold" size="sm">
                      Deseja realmente saír?
                    </Text>
                  </Stack>
                </>
              ),
              labels: {
                confirm: (
                  <Button loading={isLoading} color="red">
                    Saír
                  </Button>
                ),
                cancel: 'Cancelar',
              },
              confirmProps: { color: 'red' },
              onCancel: () => modals.closeAll(),
              onConfirm: () => handleLogoutClick(),
            })
          }
          fullWidth
          leftIcon={<IconLogout size={18} />}
        >
          Saír
        </Button>
      </Box>
    </AsideDrawer>
  );

  return (
    <>
      <UnstyledButton onClick={() => dispatch(layoutAction.toggleDrawer())}>
        <Group>
          <Avatar size={35} color="red" src={user?.picture} />
          <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            {isLoading ? (
              <Loader size="sm" variant="dots" />
            ) : (
              <div>
                <Text size="sm"> {user?.nickname}</Text>
                <Text size="xs" color="dimmed">
                  {user?.email}
                </Text>
              </div>
            )}
          </MediaQuery>
        </Group>
      </UnstyledButton>
      {Drawer}
    </>
  );
}
