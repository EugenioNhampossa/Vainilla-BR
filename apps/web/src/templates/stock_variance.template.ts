export const stockVarianceTemplate = `
<!doctype html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <title>Stock Variance</title>
  </head>
  <body>
    <div class="m-5 space-y-4">
      <div class="">
        <div class="text-4xl font-bold text-blue-500">LOGO</div>
        <div class="text-xs text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
      </div>
      <div class="flex items-center justify-between w-[87vw]">
        <div class="text-lg font-bold text-gray-800">Stock Variance Report</div>
        <div class="text-sm text-gray-800">Data: <%=new Date().toLocaleString('pt-PT',{ dateStyle: 'medium' })%></div>
      </div>
      <div class="border">
        <table class="w-full text-left text-sm text-gray-700">
          <thead class="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th scope="col" class="px-4 py-3">Código</th>
              <th scope="col" class="px-4 py-3">Artigo</th>
              <th scope="col" class="px-4 py-3">Unidade</th>
              <th scope="col" class="px-4 py-3">Stock Inicial</th>
              <th scope="col" class="px-4 py-3">Compras</th>
              <th scope="col" class="px-4 py-3">Transf.</th>
              <th scope="col" class="px-4 py-3">Desperdícios</th>
              <th scope="col" class="px-4 py-3">Ofertas</th>
              <th scope="col" class="px-4 py-3">Stock Final</th>
              <th scope="col" class="px-4 py-3">Qtd. real</th>
              <th scope="col" class="px-4 py-3">Qtd. teórica</th>
              <th scope="col" class="px-4 py-3">Diferença</th>
              <th scope="col" class="px-4 py-3">P. Custo</th>
              <th scope="col" class="px-4 py-3">Valor</th>
            </tr>
          </thead>
          <tbody>
          <%artigos.variacao.forEach((artigo)=>{%>
              <tr class="border-b odd:bg-white even:bg-gray-50">
                <td class="px-4 py-2">#<%=artigo.codigo%></td>
                <td class="px-4 py-2"><%=artigo.titulo%></td>
                <td class="px-4 py-2"><%=artigo.unidade%></td>
                <td class="px-4 py-2"><%=artigo.stock_inicial%></td>
                <td class="px-4 py-2"><%=artigo.compras%></td>
                <td class="px-4 py-2"><%=artigo.transTotal%></td>
                <td class="px-4 py-2"><%=artigo.desperdicios%></td>
                <td class="px-4 py-2"><%=artigo.ofertas%></td>
                <td class="px-4 py-2"><%=artigo.stock_final%></td>
                <td class="px-4 py-2"><%=artigo.qtyReal%></td>
                <td class="px-4 py-2"><%=artigo.totalPedidos%></td>
                <td class="px-4 py-2"><%=artigo.diferenca%></td>
                <td class="px-4 py-2"><%=artigo.precoCusto%></td>
                <td class="px-4 py-2"><%=artigo.valor%></td>
              </tr>
            <%})%>
          </tbody>
        </table>
      </div>
       <div class="mt-4 flex items-center gap-4">
            <div class="font-bold text-gray-700">Valor de Perda:</div>
            <div><%=artigos.totalPerda%></div>
       </div>
    </div>
  </body>
</html>
`;
