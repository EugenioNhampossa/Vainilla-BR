export const countSheetTemplate = `
<!doctype html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <title>Item Recipies</title>
  </head>
  <body>
    <div class="m-5 space-y-4">
      <div class="">
        <div class="text-4xl font-bold text-blue-500">LOGO</div>
        <div class="text-xs text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
      </div>
      <div class="flex items-center justify-between">
        <div class="text-lg font-bold text-gray-800">Stock Count Report</div>
        <div class="text-sm text-gray-800">Data: <%=new Date().toLocaleString('pt-PT',{ dateStyle: 'medium' })%></div>
      </div>
      <div class="border">
        <table class="w-full text-left text-sm text-gray-700">
          <thead class="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th scope="col" class="px-4 py-3">Código</th>
              <th scope="col" class="px-4 py-3">Artigo</th>
              <th scope="col" class="px-4 py-3">Unidade</th>
              <th scope="col" class="px-4 py-3">Qtd. Preparada</th>
              <th scope="col" class="px-4 py-3">Qtd. Não Preparada</th>
            </tr>
          </thead>
          <tbody>
          <%artigos.forEach((artigo)=>{%>
              <tr class="border-b odd:bg-white even:bg-gray-50">
                <td class="px-4 py-2">#<%=artigo.codigo%></td>
                <td class="px-4 py-2"><%=artigo.titulo%></td>
                <td class="px-4 py-2"><%=artigo.unidade%></td>
                <td class="px-4 py-2">
                  <input class="border p-[4px]" />
                </td>
                <td class="px-4 py-2">
                  <input class="border p-[4px]" />
                </td>
              </tr>
            <%})%>
          </tbody>
        </table>
      </div>
    </div>
  </body>
</html>
`;
