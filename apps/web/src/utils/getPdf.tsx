import { useState } from 'react';
import jsPDF, { jsPDFOptions } from 'jspdf';
import * as ejs from 'ejs';
import { notify } from '../Components/Modals/Notification';

export function useGetPdf(props?: jsPDFOptions, windowWidth?: number) {
  const [isLoading, setIsLoading] = useState(false);

  const generatePdf = async ({
    data,
    fileName,
    template,
  }: {
    data: any;
    fileName: string;
    template: string;
  }) => {
    try {
      setIsLoading(true);

      const doc = new jsPDF({
        orientation: props?.orientation || 'p',
        unit: 'pt',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 'smart',
      });

      const html = ejs.render(template, data);

      await doc.html(html, {
        callback: function (doc) {
          const formattedDate = new Date().toLocaleString('pt-PT', {
            dateStyle: 'short',
          });
          doc.save(`${formattedDate}-${fileName}`);
        },
        x: 10,
        y: 10,
        width: 575,
        windowWidth: windowWidth || 1000,
        margin: [20, 0, 40, 0],
      });
    } catch (error) {
      console.log({ error });

      notify({
        title: 'Erro',
        message: 'Ocorreu um erro ao gerar o pdf',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { generatePdf, isLoading };
}
