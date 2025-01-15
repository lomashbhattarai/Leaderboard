import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  Button,
} from "@mui/material";

export interface ColumnConfig {
  label: string;
  key: string;
  align?: "left" | "right" | "center";
  render?: (value: any, row: any) => React.ReactNode;
  getValue?: (row: any) => any;
}

const TableView = ({
  columns,
  tableData,
  title,
  onDeleteTransaction,
  showFooter = false,
}: {
  columns: ColumnConfig[];
  tableData: any[];
  title?: string;
  onDeleteTransaction?: (index: number) => void;
  showFooter?: boolean;
}) => {
  return (
    <TableContainer component={Paper}>
      {title && <h2>{title}</h2>}
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} align={column.align}>
                {column.label}
              </TableCell>
            ))}
            {onDeleteTransaction && <TableCell />}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, rowIndex) => (
            <TableRow key={row.id || rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} align={column.align}>
                  {column.render
                    ? column.render(
                        column.getValue
                          ? column.getValue(row)
                          : row[column.key],
                        row
                      )
                    : column.getValue
                    ? column.getValue(row)
                    : row[column.key]}
                </TableCell>
              ))}
              {onDeleteTransaction && (
                <TableCell>
                  <Button onClick={() => onDeleteTransaction(rowIndex)}>
                    Delete
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        {showFooter && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length} align="right">
                Total:
              </TableCell>
              <TableCell>total X</TableCell>
              {onDeleteTransaction && <TableCell />}
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default TableView;
