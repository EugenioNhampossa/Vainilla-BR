import { api } from '../Shared/api';

export const fetchPDF = async ({
  url,
  filename,
}: {
  url: string;
  filename: string;
}) => {
  try {
    const response = await api.get(url, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.log({ error });
  }
};
