import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { chessColors } from './theme';

// ----------------------------------------------------------------------

type DateBadgeProps = {
  startDate: string;
  endDate: string;
};

export function DateBadge({ startDate, endDate }: DateBadgeProps) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const multi = !start.isSame(end, 'day');
  const shown = multi ? end : start;

  return (
    <Box
      sx={{
        width: 68,
        height: 68,
        border: `2px solid ${chessColors.green}`,
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1.05,
        bgcolor: '#fff',
      }}
    >
      {multi && (
        <Typography sx={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.6, color: chessColors.green }}>
          UNTIL
        </Typography>
      )}
      <Typography sx={{ fontSize: 22, fontWeight: 800, color: chessColors.ink }}>{shown.format('D')}</Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.4, color: chessColors.ink }}>
        {shown.format('MMM').toUpperCase()}
      </Typography>
    </Box>
  );
}
