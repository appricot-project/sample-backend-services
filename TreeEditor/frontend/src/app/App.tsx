import { TreeEditorPage } from '@/pages/tree-editor';
import { AppProviders } from './providers/AppProviders';
import { ErrorBoundary } from './providers/ErrorBoundary';
import { Notifier } from './providers/Notifier';

export function App() {
  return (
    <AppProviders>
      <ErrorBoundary>
        <TreeEditorPage />
      </ErrorBoundary>
      <Notifier />
    </AppProviders>
  );
}
