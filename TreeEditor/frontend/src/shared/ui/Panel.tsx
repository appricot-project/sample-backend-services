import type { ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface PanelProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function Panel({ title, subtitle, actions, children }: PanelProps) {
  return (
    <Paper variant="outlined" className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-3">
        <div>
          <Typography variant="subtitle1" className="font-semibold">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-1">{actions}</div>}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-2">{children}</div>
    </Paper>
  );
}
