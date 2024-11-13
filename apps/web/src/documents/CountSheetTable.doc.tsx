import { Document, Page, Text, View } from '@react-pdf/renderer';
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';
import { createTw } from 'react-pdf-tailwind';
import { useEffect, useState } from 'react';

const tw = createTw({});

export function CountSheetTable({ produtos }: any) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(produtos);
  }, [produtos]);

  return (
    <Document>
      <Page size="A4" style={tw('p-8 text-xs')}>
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text style={tw('text-xl')}>Stock count sheet</Text>
            <Text>{new Date().toLocaleDateString()}</Text>
          </View>
          <View>
            <Table>
              <TH style={tw('bg-gray-100')}>
                <TD style={tw('p-1')}>Código</TD>
                <TD style={tw('p-1')}>Produto</TD>
                <TD style={tw('p-1')}>Quantidade preparada</TD>
                <TD style={tw('p-1')}>Quantidade por preparar</TD>
              </TH>
              {data?.map((produto: any) => (
                <TR>
                  <TD style={tw('p-1')}>{produto.codigo}</TD>
                  <TD style={tw('p-1')}>{produto.titulo}</TD>
                  <TD style={tw('p-1')}></TD>
                  <TD style={tw('p-1')}></TD>
                </TR>
              ))}
            </Table>
          </View>
        </View>
      </Page>
    </Document>
  );
}
