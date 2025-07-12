// components/Table/TableHead.tsx
import * as React from 'react';
import { TableHead, TableSortLabel, Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Order, Data, HeadCell, StyledTableCell, StickyTableCell, StickyTableRow } from './Utils';

interface EnhancedTableHeadProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
  headCells: readonly HeadCell[];
  stickyColumnIds: string[];
  stickyRight?: boolean;
}

export function EnhancedTableHead({
  onRequestSort, order, orderBy, headCells, stickyColumnIds, stickyRight,
}: EnhancedTableHeadProps) {
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <StickyTableRow>
        {headCells.map((headCell, index) => {
          const Cell = stickyColumnIds.includes(headCell.id) ? StickyTableCell : StyledTableCell;
          return (
            <Cell
              key={headCell.id}
              align="center"
              sortDirection={orderBy === headCell.id ? order : false}
              sx={stickyColumnIds.includes(headCell.id)
                ? { position: 'sticky', left: index + 1, zIndex: 3 }
                : {}}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id && (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                )}
              </TableSortLabel>
            </Cell>
          );
        })}
        {stickyRight && (
          <StyledTableCell
            padding="checkbox"
            align="center"
            sx={{ position: 'sticky', right: 0, zIndex: 2, width: '48px' }}
          />
        )}
      </StickyTableRow>
    </TableHead>
  );
}