import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ResetButton } from "@/features/reset-app";
import { CachedTreeView } from "@/widgets/cached-tree-view";
import { DbTreeView } from "@/widgets/db-tree-view";

export function TreeEditorPage() {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <AppBar position="static" elevation={0}>
        <Toolbar className="justify-between">
          <Typography variant="h6">Tree Editor</Typography>
          <ResetButton />
        </Toolbar>
      </AppBar>
      <main className="flex min-h-0 flex-1 flex-col gap-4 p-4 md:flex-row">
        <DbTreeView />
        <CachedTreeView />
      </main>
    </div>
  );
}
