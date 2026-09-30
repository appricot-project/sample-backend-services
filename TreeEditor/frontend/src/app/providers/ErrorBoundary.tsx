import { Component, type ErrorInfo, type ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import { CACHE_STORAGE_KEY } from '@/entities/cached-node';

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  private clearCacheAndReload = () => {
    try {
      localStorage.removeItem(CACHE_STORAGE_KEY);
    } finally {
      location.reload();
    }
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Alert
          severity="error"
          className="max-w-lg"
          action={
            <div className="flex flex-col gap-1">
              <Button color="inherit" size="small" onClick={() => location.reload()}>
                Reload
              </Button>
              <Button color="inherit" size="small" onClick={this.clearCacheAndReload}>
                Clear cache
              </Button>
            </div>
          }
        >
          <AlertTitle>Something went wrong</AlertTitle>
          {this.state.error.message}
        </Alert>
      </div>
    );
  }
}
