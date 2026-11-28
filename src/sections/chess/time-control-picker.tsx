import { useState } from 'react';

import BoltIcon from '@mui/icons-material/Bolt';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
  sameTimeControl,
  sectionTimeParts,
  TIME_CONTROL_PRESETS,
  type TimeControlPreset,
  sectionTimeControlLabel,
  type SectionTimeControl,
} from './format';

const GROUPS: { id: TimeControlPreset['group']; label: string; icon: typeof BoltIcon }[] = [
  { id: 'blitz', label: 'Blitz', icon: BoltIcon },
  { id: 'rapid', label: 'Rapid', icon: TimerOutlinedIcon },
  { id: 'classical', label: 'Classical', icon: HourglassEmptyOutlinedIcon },
];

type TimeControlPickerProps = {
  fieldId: string;
  value: SectionTimeControl;
  message?: string;
  onChange: (value: SectionTimeControl) => void;
};

export function TimeControlPicker({ fieldId, value, message, onChange }: TimeControlPickerProps) {
  const selected = sectionTimeParts(value);
  const presetSelected = TIME_CONTROL_PRESETS.some((preset) => sameTimeControl(preset, selected));
  const [custom, setCustom] = useState(() =>
    presetSelected || (!selected.timeMinutes && !selected.timeSeconds)
      ? { min: '', sec: '', inc: '' }
      : {
          min: selected.timeMinutes ? String(selected.timeMinutes) : '',
          sec: selected.timeSeconds ? String(selected.timeSeconds) : '',
          inc: selected.incrementSeconds ? String(selected.incrementSeconds) : '',
        }
  );
  const [customError, setCustomError] = useState('');
  const label = sectionTimeControlLabel(selected);

  const applyCustom = () => {
    const minutes = custom.min === '' ? 0 : Number(custom.min);
    const seconds = custom.sec === '' ? 0 : Number(custom.sec);
    const increment = custom.inc === '' ? 0 : Number(custom.inc);
    if ([minutes, seconds, increment].some((part) => Number.isNaN(part) || part < 0)) {
      setCustomError('Enter minutes, seconds, and increment of zero or more.');
      return;
    }
    if (seconds > 59) {
      setCustomError('Enter seconds from 0 to 59.');
      return;
    }
    if (minutes === 0 && seconds === 0) {
      setCustomError('Enter minutes or seconds.');
      return;
    }
    setCustomError('');
    onChange({ timeMinutes: minutes, timeSeconds: seconds, incrementSeconds: increment, timeDays: 0 });
  };

  return (
    <Box id={fieldId} sx={{ mt: 2 }}>
      <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: 1, gap: 1 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: '#637381' }}>
          Time control
        </Typography>
        {label && (
          <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#175195' }}>{label}</Typography>
        )}
      </Stack>
      {message && (
        <Typography sx={{ color: '#d32f2f', fontSize: 12, fontWeight: 700, mb: 1.5, lineHeight: 1.4 }}>
          <Box component="span" sx={{ mr: 0.4 }}>*</Box>
          {message}
        </Typography>
      )}
      <Stack spacing={1.5}>
        {GROUPS.map((group) => {
          const Icon = group.icon;
          const presets = TIME_CONTROL_PRESETS.filter((preset) => preset.group === group.id);
          return (
            <Box key={group.id}>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.75 }}>
                <Icon sx={{ fontSize: 16, color: '#175195' }} />
                <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#12325f' }}>{group.label}</Typography>
              </Stack>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(108px, 1fr))', gap: 1 }}>
                {presets.map((preset) => {
                  const active = sameTimeControl(preset, selected);
                  return (
                    <Box
                      key={preset.id}
                      component="button"
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setCustomError('');
                        onChange({
                          timeMinutes: preset.timeMinutes,
                          timeSeconds: preset.timeSeconds,
                          incrementSeconds: preset.incrementSeconds,
                          timeDays: preset.timeDays,
                        });
                      }}
                      sx={{
                        py: 1.1,
                        px: 1,
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: active ? '#175195' : '#DFE3E8',
                        bgcolor: active ? '#e8f1fa' : '#fff',
                        color: active ? '#175195' : '#12325f',
                        fontWeight: 700,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        boxShadow: active ? 'inset 0 0 0 1px #175195' : 'none',
                        '&:hover': { borderColor: '#175195' },
                      }}
                    >
                      {preset.label}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
        <Box>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.75 }}>
            <TuneOutlinedIcon sx={{ fontSize: 16, color: '#175195' }} />
            <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#12325f' }}>Custom</Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
            {([
              ['min', 'min'],
              ['sec', 'sec'],
              ['inc', 'inc'],
            ] as const).map(([key, placeholder]) => (
              <TextField
                key={key}
                size="small"
                type="number"
                placeholder={placeholder}
                autoComplete="off"
                value={custom[key]}
                onChange={(event) => setCustom((current) => ({ ...current, [key]: event.target.value }))}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    applyCustom();
                  }
                }}
                slotProps={{ htmlInput: { min: 0, max: key === 'sec' ? 59 : undefined, 'aria-label': placeholder } }}
                sx={{ flex: 1 }}
              />
            ))}
            <IconButton
              aria-label="Use custom time control"
              onClick={applyCustom}
              sx={{ bgcolor: '#175195', color: '#fff', borderRadius: 1.5, width: 40, height: 40, '&:hover': { bgcolor: '#124578' } }}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </Stack>
          {customError && (
            <Typography sx={{ color: '#d32f2f', fontSize: 12, fontWeight: 700, mt: 0.75 }}>
              <Box component="span" sx={{ mr: 0.4 }}>*</Box>
              {customError}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
