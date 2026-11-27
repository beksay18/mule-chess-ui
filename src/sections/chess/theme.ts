export const chessColors = {
  headerBg: '#f6f3ec',
  headerBorder: '#e7e1d6',
  ink: '#1c1c1c',
  muted: '#5e6772',
  line: '#e6e8ec',
  link: '#1565c0',
  green: '#1e7a34',
  greenHover: '#17632b',
  panel: '#f3f4f6',
  hero: '#1c2a24',
};

export const registerButtonSx = {
  bgcolor: chessColors.green,
  fontWeight: 700,
  borderRadius: 1,
  px: 1.75,
  whiteSpace: 'nowrap',
  '&:hover': { bgcolor: chessColors.greenHover },
} as const;

export const entryButtonSx = {
  borderColor: chessColors.link,
  color: chessColors.link,
  fontWeight: 700,
  borderRadius: 1,
  px: 1.75,
  whiteSpace: 'nowrap',
} as const;
