import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { formatRange } from './format';
import { SiteShell, usePageTitle } from './site-shell';
import { useChessState } from './store';
import { chessColors } from './theme';

// ----------------------------------------------------------------------

export function ResultsView() {
  usePageTitle('Results and pairings · Mule Chess');
  const chess = useChessState();
  const events = chess.results
    .map((result) => ({
      result,
      tournament: chess.tournaments.find((item) => item.id === result.tournamentId),
    }))
    .filter((item) => item.tournament);
  const [selectedId, setSelectedId] = useState(events[0]?.result.tournamentId ?? '');
  const selected = events.find((item) => item.result.tournamentId === selectedId) ?? events[0];
  const rounds = selected ? [...new Set(selected.result.pairings.map((pairing) => pairing.round))] : [];

  return (
    <SiteShell>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Results / Pairings
        </Typography>
        <Typography sx={{ color: chessColors.muted, mb: 3 }}>
          Standings and pairings published for Mule Chess events.
        </Typography>

        {events.length === 0 && <Typography>No results have been posted yet.</Typography>}

        {events.length > 0 && selected?.tournament && (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Stack spacing={1} sx={{ minWidth: { md: 280 } }}>
              {events.map((item) => {
                const active = item.result.tournamentId === selected.result.tournamentId;
                return (
                  <Box
                    key={item.result.tournamentId}
                    component="button"
                    onClick={() => setSelectedId(item.result.tournamentId)}
                    sx={{
                      textAlign: 'left',
                      border: `1px solid ${active ? chessColors.link : chessColors.line}`,
                      bgcolor: active ? '#eef4fc' : '#fff',
                      borderRadius: 1,
                      px: 1.5,
                      py: 1.25,
                      cursor: 'pointer',
                    }}
                  >
                    <Typography sx={{ fontWeight: 700 }}>{item.tournament?.name}</Typography>
                    <Typography variant="body2" sx={{ color: chessColors.muted }}>
                      {item.tournament ? formatRange(item.tournament) : ''}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                {selected.tournament.name}
              </Typography>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>Standings</Typography>
              <Table size="small" sx={{ mb: 3 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Place</TableCell>
                    <TableCell>Player</TableCell>
                    <TableCell>Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selected.result.standings.map((row) => (
                    <TableRow key={`${row.place}-${row.player}`}>
                      <TableCell>{row.place}</TableCell>
                      <TableCell>{row.player}</TableCell>
                      <TableCell>{row.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {rounds.map((round) => (
                <Box key={round} sx={{ mb: 3 }}>
                  <Typography sx={{ fontWeight: 800, mb: 1 }}>Round {round}</Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Board</TableCell>
                        <TableCell>White</TableCell>
                        <TableCell>Black</TableCell>
                        <TableCell>Result</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selected.result.pairings
                        .filter((pairing) => pairing.round === round)
                        .map((pairing) => (
                          <TableRow key={`${round}-${pairing.board}`}>
                            <TableCell>{pairing.board}</TableCell>
                            <TableCell>{pairing.white}</TableCell>
                            <TableCell>{pairing.black}</TableCell>
                            <TableCell>{pairing.result}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Box>
              ))}
            </Box>
          </Stack>
        )}
      </Container>
    </SiteShell>
  );
}
