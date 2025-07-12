// components/Table/Table.tsx
import * as React from 'react';
import {
  Box, Paper, Table, TableBody, TableContainer, TablePagination,
} from '@mui/material';
import { EnhancedTableHead } from './TableHead';
import { EnhancedTableToolbar } from './Toolbar';
import {
  Order, getComparator, Data, HeadCell, StyledTableCell,
  StyledTableRow, StickyTableCell,
} from './Utils';
import LongMenu from '../Menu/Menu';

export interface EnhancedTableProps {
  rows: Data[];
  headCells: readonly HeadCell[];
  defaultSort: string;
  title?: React.ReactNode;
  toolbarActions?: React.ReactNode;
  defaultRows: number;
  stickyColumnIds: string[];
  page: number;
  count: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newItemsPerPage: number) => void;
  stickyRight?: boolean;
  menuOptions?: string[];
  onOptionSelect?: (action: string, row: Data) => void;
  tableContainerSx?: object;
  renderCell?: (key: string, value: any, row: Data) => React.ReactNode;
}

export const EnhancedTable: React.FC<EnhancedTableProps> = ({
  rows, headCells, defaultSort, title, toolbarActions, defaultRows,
  stickyColumnIds, page, count, onPageChange, onRowsPerPageChange,
  stickyRight, menuOptions, onOptionSelect, tableContainerSx, renderCell
}) => {
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<string>(defaultSort);
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRows);
  const [currentPage, setCurrentPage] = React.useState(page);

  const handleRequestSort = (_: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(String(property));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRows = parseInt(event.target.value, 10);
    setRowsPerPage(newRows);
    onRowsPerPageChange(newRows);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setCurrentPage(newPage);
    onPageChange(newPage);
  };

  const visibleRows = React.useMemo(() => {
    return [...rows].sort(getComparator(order, orderBy));
  }, [order, orderBy, rows]);

  return (
  <Box sx={{ width: '100%', overflowX: 'auto' }}>
    <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
      
      {(title || toolbarActions) && (
        <Box sx={{ mb: 1 }}>
          <EnhancedTableToolbar title={title} actions={toolbarActions} />
        </Box>
      )}

      <TableContainer
        sx={{
          maxHeight: { xs: 'calc(100vh - 260px)', sm: '72vh' },
          overflowX: 'auto',
          overflowY: 'auto',
        }}
      >
        <Table stickyHeader size="small" aria-label="enhanced table">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={headCells}
            stickyColumnIds={stickyColumnIds}
            stickyRight={stickyRight}
          />
          <TableBody>
            {visibleRows.map((row, rowIndex) => (
              <StyledTableRow hover key={row.id}>
                {headCells.map((headCell, colIndex) => {
                  const sticky = stickyColumnIds.includes(headCell.id);
                  const Cell = sticky ? StickyTableCell : StyledTableCell;
                  const cellValue = row[headCell.id];
                  return (
                    <Cell
                      key={headCell.id}
                      align="center"
                      sx={sticky ? {
                        position: 'sticky',
                        left: colIndex + 1,
                        zIndex: 1,
                        backgroundColor: '#f9fafb',
                      } : {}}
                    >
                      {renderCell
                        ? renderCell(headCell.id, cellValue, row)
                        : String(cellValue ?? '--')}
                    </Cell>
                  );
                })}
                {stickyRight && (
                  <StickyTableCell
                    padding="checkbox"
                    sx={{ position: 'sticky', right: 0, zIndex: 2 }}
                  >
                    <LongMenu
                      options={menuOptions}
                      onOptionSelect={(option) => onOptionSelect?.(option, row)}
                    />
                  </StickyTableCell>
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  </Box>

  );
};