import { TreeEditorPage } from '@/pages/tree-editor';
import { AppProviders } from './providers/AppProviders';
import { Notifier } from './providers/Notifier';

export function App() {
  return (
    <AppProviders>
      <TreeEditorPage />
      <Notifier />
    </AppProviders>
  );
}
