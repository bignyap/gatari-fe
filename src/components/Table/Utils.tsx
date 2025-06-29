import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export type Order = 'asc' | 'desc';

export interface Data {
  [key: string]: any;
}

export interface HeadCell {
  id: string;
  label: string;
  width?: number;
}

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const commonFont = {
  fontSize: '0.85rem',
  fontFamily: 'Inter, Roboto, system-ui, sans-serif',
};

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  ...commonFont,
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    color: '#ffffff',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    padding: theme.spacing(1, 2),
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  [`&.${tableCellClasses.body}`]: {
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '240px',
    position: 'relative',
    padding: theme.spacing(1, 2),
    '&:hover::after': {
      content: 'attr(data-full-text)',
      position: 'absolute',
      backgroundColor: theme.palette.background.paper,
      padding: '8px',
      borderRadius: '4px',
      boxShadow: theme.shadows[1],
      whiteSpace: 'normal',
      zIndex: 10,
      top: '100%',
      left: 0,
      transform: 'translateY(5px)',
    },
  },
}));

export const StickyTableCell = styled(TableCell)(({ theme }) => ({
  ...commonFont,
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)', // ← same as CommonButton default
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#1a1a1a',
    fontSize: '0.85rem',
    fontWeight: 600,
    fontFamily: 'Inter, Roboto, system-ui, sans-serif',
    whiteSpace: 'nowrap',
    padding: theme.spacing(1, 2),
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
  [`&.${tableCellClasses.body}`]: {
    position: 'sticky',
    left: 0,
    zIndex: 2,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1, 2),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '240px',
    '&:hover::after': {
      content: 'attr(data-full-text)',
      position: 'absolute',
      backgroundColor: theme.palette.background.paper,
      padding: '8px',
      borderRadius: '4px',
      boxShadow: theme.shadows[1],
      whiteSpace: 'normal',
      zIndex: 10,
      top: '100%',
      left: 0,
      transform: 'translateY(5px)',
    },
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'background-color 0.2s ease-in-out',
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  '&:hover': {
    backgroundColor: 'rgba(81, 20, 20, 0.08)',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const StickyTableRow = styled(TableRow)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 4,
  backgroundColor: 'rgba(33, 48, 66, 0.85)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
}));

export function FormatCellValue(cellValue: any): any {
  if (cellValue === null) return "--";
  if (typeof cellValue === 'boolean') return cellValue ? "True" : "False";
  if (typeof cellValue === 'object') return JSON.stringify(cellValue);
  return cellValue;
}