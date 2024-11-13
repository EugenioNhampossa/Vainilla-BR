import { useQuery } from 'react-query';
import { api } from '../../Shared/api';

const fetchArtigoByCodigoBarras = (codigoBarras: string) => {
  if (codigoBarras) {
    return api.get(`/artigos/barcode/${codigoBarras}`);
  } else {
    return undefined;
  }
};

export const usefetchArtigoByCodigoBarras = (
  codigoBarras: string,
  onError: any,
) => {
  return useQuery(
    ['artigo', codigoBarras],
    () => fetchArtigoByCodigoBarras(codigoBarras),
    {
      enabled: !!codigoBarras,
      onError,
    },
  );
};
