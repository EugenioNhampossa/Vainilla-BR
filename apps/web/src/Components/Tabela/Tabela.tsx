import { Box } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';

const PAGE_SIZES = [5, 20, 35, 50, 70];

export const Tabela = ({
  columns,
  data,
  height,
  isLoading,
  page,
  setPage,
  perPage,
  setPerPage,
  rowExpansion,
  onRowClick,
}: any) => {
  const [records, setRecords] = useState(data?.data);

  useEffect(() => {    
    setRecords(data?.data);
  }, [data]);

  const handleRecordsPerPageChange = (size: number) => {
    setPerPage(size);
    setPage(1);
  };

  return (
    <Box sx={{ height: height || 500 }}>
      <DataTable
        striped
        rowExpansion={rowExpansion}
        highlightOnHover
        noRecordsText="Sem dados por mostrar"
        onRowClick={(record) => onRowClick(record) || undefined}
        minHeight={150}
        columns={columns}
        fetching={isLoading}
        records={records}
        recordsPerPageLabel="Linhas por página"
        page={page}
        totalRecords={data?.meta?.total}
        recordsPerPage={perPage}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={(size) => handleRecordsPerPageChange(size)}
        onPageChange={(page) => setPage(page)}
      />
    </Box>
  );
};
