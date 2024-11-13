import { MantineProvider, MantineThemeOverride } from '@mantine/core';



interface ThemeProviderProps {
  children: React.ReactNode;
  theme: any
}

export function ThemeProvider({ children, theme}: ThemeProviderProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      {children}
    </MantineProvider>
  );
}
