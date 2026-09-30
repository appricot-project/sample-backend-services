import type { ReactNode } from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 1 },
  },
});

const theme = createTheme({
  shape: { borderRadius: 8 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    // enableCssLayer puts MUI styles into the `mui` layer so Tailwind utilities can override them.
    <StyledEngineProvider enableCssLayer>
      {/* MUI global styles are injected at the top of <head>, so the layer order must be declared
          here first; otherwise `mui` ends up below Tailwind's preflight and loses its paddings. */}
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>{children}</JotaiProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
