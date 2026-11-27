export const chessColors = {
  headerBg: '#f9fafb',
  headerBorder: 'rgba(23, 81, 149, 0.1)',
  ink: '#141A21',
  muted: '#637381',
  line: '#DFE3E8',
  link: '#175195',
  green: '#175195',
  greenHover: '#124578',
  panel: '#F9FAFB',
  hero: '#ffffff',
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
