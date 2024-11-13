import React from 'react';
import CallBack from '../Pages/Callback/CallBack';
import PedidoUpdateForm from '../Pages/Pedidos/pedidoUpdateForm';
import { PedidosList } from '../Pages/Producao/pedidosList';
import { Producao } from '../Pages/Producao/producao';
const ProducaoCreateForm = React.lazy(
  () => import('../Pages/Producao/producaoCreateForm'),
);
const VendasPorProduto = React.lazy(
  () => import('../Pages/RelatoriosPedidos/VendasPorProduto'),
);
const SaidaCreateForm = React.lazy(
  () => import('../Pages/Movimentos/SaidaCreateForm'),
);

const EntradaCreateForm = React.lazy(
  () => import('../Pages/Movimentos/EntradaCreateForm'),
);
const StockVarianceReport = React.lazy(
  () => import('../Pages/RelatoriosStock/StockVariance/report'),
);

const VendasPorPeriodo = React.lazy(
  () => import('../Pages/RelatoriosPedidos/VendasPorPeriodo'),
);
const StockTake = React.lazy(
  () => import('../Pages/RelatoriosStock/StockTake/report'),
);
const CountSheet = React.lazy(
  () => import('../Pages/RelatoriosStock/CountSheet/CountSheet'),
);
const CountSheetForm = React.lazy(
  () => import('../Pages/RelatoriosStock/CountSheet/CountSheetForm'),
);
const RelatoriosStock = React.lazy(
  () => import('../Pages/RelatoriosStock/Lista'),
);
const PedidoInfo = React.lazy(() => import('../Pages/Pedidos/PedidoInfo'));
const PedidoList = React.lazy(() => import('../Pages/Pedidos/PedidoList'));
const PedidoCreateForm = React.lazy(
  () => import('../Pages/Pedidos/PedidoCreateForm'),
);
const VendaReport = React.lazy(
  () => import('../Pages/RelatoriosPedidos/Pedido.report'),
);
const ProdutoList = React.lazy(() => import('../Pages/Produtos/ProdutoList'));
const CategoriaList = React.lazy(
  () => import('../Pages/Categorias/CategoriaList'),
);
const ProdutoCreateForm = React.lazy(
  () => import('../Pages/Produtos/ProdutoCreateForm'),
);
const CategoriaCreateForm = React.lazy(
  () => import('../Pages/Categorias/CategoriaCreateForm'),
);
const ProdutoUpdateForm = React.lazy(
  () => import('../Pages/Produtos/ProdutoUpdateForm'),
);
const ProdutoInfo = React.lazy(() => import('../Pages/Produtos/ProdutoInfo'));

const Home = React.lazy(() => import('../Pages/Home'));
const Dashboard = React.lazy(() => import('../Pages/Dashboard'));
const NotFound = React.lazy(() => import('../Pages/Errors/NotFound'));
const ServerError = React.lazy(() => import('../Pages/Errors/ServerError'));
const AccessDenied = React.lazy(() => import('../Pages/Errors/AccessDenied'));

const ClienteList = React.lazy(() => import('../Pages/Cliente/ClienteList'));
const ClienteCreateForm = React.lazy(
  () => import('../Pages/Cliente/ClienteCreateForm'),
);
const ClienteUpdateForm = React.lazy(
  () => import('../Pages/Cliente/ClienteUpdateForm'),
);
const FornecedorList = React.lazy(
  () => import('../Pages/Fornecedor/FornecedorList'),
);
const FornecedorUpdateForm = React.lazy(
  () => import('../Pages/Fornecedor/FornecedorUpdateForm'),
);
const FornecedorCreateForm = React.lazy(
  () => import('../Pages/Fornecedor/FornecedorCreateForm'),
);

const FamiliaList = React.lazy(() => import('../Pages/Familia/FamiliaList'));
const FamiliaUpdateForm = React.lazy(
  () => import('../Pages/Familia/FamiliaUpdateForm'),
);
const FamiliaCreateForm = React.lazy(
  () => import('../Pages/Familia/FamiliaCreateForm'),
);
const SubFamiliaList = React.lazy(
  () => import('../Pages/SubFamilia/SubFamiliaList'),
);
const SubFamiliaUpdateForm = React.lazy(
  () => import('../Pages/SubFamilia/SubFamiliaUpdateForm'),
);
const SubFamiliaCreateForm = React.lazy(
  () => import('../Pages/SubFamilia/SubFamiliaCreateForm'),
);

const MarcaList = React.lazy(() => import('../Pages/Marca/MarcaList'));
const MarcaUpdateForm = React.lazy(
  () => import('../Pages/Marca/MarcaUpdateForm'),
);
const MarcaCreateForm = React.lazy(
  () => import('../Pages/Marca/MarcaCreateForm'),
);

const ArtigoInfo = React.lazy(() => import('../Pages/Artigo/ArtigoInfo'));
const ArtigoList = React.lazy(() => import('../Pages/Artigo/ArtigoList'));
const ArtigoUpdateForm = React.lazy(
  () => import('../Pages/Artigo/ArtigoUpdateForm'),
);
const ArtigoCreateForm = React.lazy(
  () => import('../Pages/Artigo/ArtigoCreateForm'),
);

const InstalacaoList = React.lazy(
  () => import('../Pages/Instalacao/InstalacaoList'),
);
const InstalacaoInfo = React.lazy(
  () => import('../Pages/Instalacao/InstalacaoInfo'),
);
const InstalacaoUpdateForm = React.lazy(
  () => import('../Pages/Instalacao/InstalacaoUpdateForm'),
);
const InstalacaoCreateForm = React.lazy(
  () => import('../Pages/Instalacao/InstalacaoCreateForm'),
);

const StockCreateForm = React.lazy(
  () => import('../Pages/Stock/StockCreateForm'),
);
const StockUpdateForm = React.lazy(
  () => import('../Pages/Stock/StockUpdateForm'),
);
const StockList = React.lazy(() => import('../Pages/Stock/StockList'));
const StockInfo = React.lazy(() => import('../Pages/Stock/StockInfo'));

const TransCreateForm = React.lazy(
  () => import('../Pages/Tranferencia/TransCreateForm'),
);
const TransList = React.lazy(() => import('../Pages/Tranferencia/TransList'));
const TransInfo = React.lazy(() => import('../Pages/Tranferencia/TransInfo'));

const CompraCreateForm = React.lazy(
  () => import('../Pages/Compra/CompraCreateForm'),
);
const CompraList = React.lazy(() => import('../Pages/Compra/CompraList'));
const CompraInfo = React.lazy(() => import('../Pages/Compra/CompraInfo'));

const MovimentoList = React.lazy(
  () => import('../Pages/Movimentos/MovimentoList'),
);

const CaixaList = React.lazy(() => import('../Pages/Caixa/CaixaList'));
const CaixaCreateForm = React.lazy(
  () => import('../Pages/Caixa/CaixaCreateForm'),
);
const CaixaInfo = React.lazy(() => import('../Pages/Caixa/CaixaInfo'));
const CaixaUpdateForm = React.lazy(
  () => import('../Pages/Caixa/CaixaUpdateForm'),
);

const UsuarioList = React.lazy(() => import('../Pages/Usuarios/UsuarioList'));
const UsuarioCreateForm = React.lazy(
  () => import('../Pages/Usuarios/UsuarioCreateForm'),
);
const UsuarioUpdateForm = React.lazy(
  () => import('../Pages/Usuarios/UsuarioUpdateForm'),
);
const UsuarioInfo = React.lazy(() => import('../Pages/Usuarios/UsuarioInfo'));

export const ROUTES = [
  {
    path: '/',
    element: <Home />,
    roles: ['admin'],
  },
  {
    path: '/callback',
    element: <CallBack />,
    roles: ['admin', 'caixa'],
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    roles: ['admin'],
  },
  {
    path: '/clientes',
    element: <ClienteList />,
    roles: ['admin'],
  },
  {
    path: '/clientes/actualizar/:id',
    element: <ClienteUpdateForm />,
    roles: ['admin'],
  },
  {
    path: '/clientes/cadastrar',
    element: <ClienteCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/produtos',
    element: <ProdutoList />,
    roles: ['admin'],
  },
  {
    path: '/produtos/actualizar/:id',
    element: <ProdutoUpdateForm />,
    roles: ['admin'],
  },
  {
    path: '/produtos/cadastrar',
    element: <ProdutoCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/produtos/:id',
    element: <ProdutoInfo />,
    roles: ['admin'],
  },
  {
    path: '/categorias',
    element: <CategoriaList />,
    roles: ['admin'],
  },
  {
    path: '/categorias/cadastrar',
    element: <CategoriaCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/fornecedores',
    element: <FornecedorList />,
    roles: ['admin'],
  },
  {
    path: '/fornecedores/actualizar/:id',
    element: <FornecedorUpdateForm />,
    roles: ['admin'],
  },
  {
    path: '/fornecedores/cadastrar',
    element: <FornecedorCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/familias',
    element: <FamiliaList />,
    roles: ['admin'],
  },
  {
    path: '/familias/actualizar/:id',
    element: <FamiliaUpdateForm />,
    roles: ['admin'],
  },
  {
    path: '/familias/cadastrar',
    element: <FamiliaCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/familias/:idfamilia/subfamilias/',
    element: <SubFamiliaList />,
    roles: ['admin'],
  },
  {
    path: '/familias/:idfamilia/subfamilias/actualizar/:idSubfamilia',
    element: <SubFamiliaUpdateForm />,
    roles: ['admin'],
  },
  {
    path: '/familias/:idfamilia/subfamilias/cadastrar',
    element: <SubFamiliaCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/marcas',
    element: <MarcaList />,
    roles: ['admin'],
  },
  {
    path: '/marcas/actualizar/:id',
    element: <MarcaUpdateForm />,
    roles: ['admin'],
  },
  {
    path: '/marcas/cadastrar',
    element: <MarcaCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/artigos',
    element: <ArtigoList />,
    roles: ['admin'],
  },
  {
    path: '/artigos/:id',
    element: <ArtigoInfo />,
    roles: ['admin'],
  },
  {
    path: '/artigos/actualizar/:id',
    element: <ArtigoUpdateForm />,
    roles: ['admin'],
  },
  {
    path: '/artigos/cadastrar',
    element: <ArtigoCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/artigos/cadastrar',
    element: <ArtigoCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/instalacoes',
    element: <InstalacaoList />,
    roles: ['admin'],
  },
  {
    path: '/instalacoes/:id',
    element: <InstalacaoInfo />,
    roles: ['admin'],
  },
  {
    path: '/instalacoes/actualizar/:id',
    element: <InstalacaoUpdateForm />,
    roles: ['admin'],
  },
  {
    path: '/instalacoes/cadastrar',
    element: <InstalacaoCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/stock',
    element: <StockList />,
    roles: ['admin'],
  },
  {
    path: '/stock/cadastrar',
    element: <StockCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/stock/:id',
    element: <StockInfo />,
    roles: ['admin'],
  },
  {
    path: '/stock/actualizar/:id',
    element: <StockUpdateForm />,
    roles: ['admin'],
  },
  {
    path: '/caixas',
    element: <CaixaList />,
    roles: ['admin'],
  },
  {
    path: '/caixas/cadastrar',
    element: <CaixaCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/producao',
    element: <Producao />,
    roles: ['admin', 'caixa'],
  },
  {
    path: '/producao/cadastrar',
    element: <ProducaoCreateForm />,
    roles: ['admin', 'caixa'],
  },
  {
    path: '/producao/pedidos',
    element: <PedidosList />,
    roles: ['admin', 'caixa'],
  },
  {
    path: '/caixas/:id',
    element: <CaixaInfo />,
    roles: ['admin'],
  },
  {
    path: '/caixas/actualizar/:id',
    element: <CaixaUpdateForm />,
    roles: ['admin'],
  },
  {
    path: '/movimentos',
    element: <MovimentoList />,
    roles: ['admin'],
  },
  {
    path: '/movimentos/saidas/cadastrar',
    element: <SaidaCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/movimentos/entradas/cadastrar',
    element: <EntradaCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/transferencias',
    element: <TransList />,
    roles: ['admin'],
  },
  {
    path: '/transferencias/:id/itens',
    element: <TransInfo />,
    roles: ['admin'],
  },
  {
    path: '/transferencias/cadastrar',
    element: <TransCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/compras',
    element: <CompraList />,
    roles: ['admin'],
  },
  {
    path: '/compras/:id/itens',
    element: <CompraInfo />,
    roles: ['admin'],
  },
  {
    path: '/compras/cadastrar',
    element: <CompraCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/pedidos',
    element: <PedidoList />,
    roles: ['admin'],
  },
  {
    path: '/pedidos/:id',
    element: <PedidoInfo />,
    roles: ['admin'],
  },
  {
    path: '/pedidos/cadastrar',
    element: <PedidoCreateForm />,
    roles: ['admin', 'caixa'],
  },
  {
    path: '/pedidos/actualizar/:id',
    element: <PedidoUpdateForm />,
    roles: ['admin', 'caixa'],
  },
  {
    path: '/usuarios',
    element: <UsuarioList />,
    roles: ['admin'],
  },
  {
    path: '/usuarios/cadastrar',
    element: <UsuarioCreateForm />,
    roles: ['admin'],
  },
  {
    path: '/relatorio/pedidos',
    element: <VendaReport />,
    roles: ['admin'],
  },
  {
    path: '/relatorios/stock',
    element: <RelatoriosStock />,
    roles: ['admin'],
  },
  {
    path: '/relatorios/stock/count-sheet',
    element: <CountSheet />,
    roles: ['admin'],
  },
  {
    path: '/relatorios/stock/count-sheet/registrar',
    element: <CountSheetForm />,
    roles: ['admin'],
  },
  {
    path: '/relatorios/stock/stock-take',
    element: <StockTake />,
    roles: ['admin'],
  },
  {
    path: '/relatorios/stock/variance',
    element: <StockVarianceReport />,
    roles: ['admin'],
  },
  {
    path: '/relatorios/pedidos/vendas-por-periodo',
    element: <VendasPorPeriodo />,
    roles: ['admin'],
  },
  {
    path: '/relatorios/pedidos/vendas-por-produto',
    element: <VendasPorProduto />,
    roles: ['admin'],
  },
  {
    path: '*',
    element: <NotFound />,
    roles: ['admin', 'caixa'],
  },
  {
    path: 'server-error',
    element: <ServerError />,
    roles: ['admin', 'caixa'],
  },
  {
    path: 'access-denied',
    element: <AccessDenied />,
    roles: ['admin', 'caixa'],
  },
];
