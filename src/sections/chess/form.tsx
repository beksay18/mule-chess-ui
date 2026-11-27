import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { chessColors } from './theme';

// ----------------------------------------------------------------------

export function FormPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box sx={{ border: `1px solid ${chessColors.line}`, borderRadius: 1, mb: 2.5 }}>
      <Typography sx={{ px: 2, py: 1.25, fontWeight: 700, borderBottom: `1px solid ${chessColors.line}` }}>
        {title}
      </Typography>
      <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 2 }}>{children}</Box>
    </Box>
  );
}

export function LabeledRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      sx={{ alignItems: { sm: 'center' }, py: 0.75 }}
    >
      <Typography
        sx={{
          width: { sm: 210 },
          flexShrink: 0,
          textAlign: { sm: 'right' },
          color: chessColors.muted,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1, maxWidth: 480 }}>{children}</Box>
    </Stack>
  );
}
