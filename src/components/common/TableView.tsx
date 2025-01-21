import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export interface ColumnConfig {
  label: string;
  key: string;
  align?: "left" | "right" | "center";
  render?: (value: any, row: any) => React.ReactNode;
  getValue?: (row: any) => any;
}

interface TableViewProps {
  columns: ColumnConfig[];
  tableData: any[];
  title?: string;
  onDeleteTransaction?: (index: number) => void;
  showFooter?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

const TableView = ({
  columns,
  tableData,
  title,
  onDeleteTransaction,
  showFooter = false,
  onEdit,
  onDelete,
  showActions = false,
}: TableViewProps) => {
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
            {(showActions || onDeleteTransaction) && (
              <TableCell>Actions</TableCell>
            )}
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
              {(showActions || onDeleteTransaction) && (
                <TableCell>
                  {showActions && (
                    <>
                      <IconButton
                        onClick={() => onEdit?.(row)}
                        size="small"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => onDelete?.(row.id)}
                        size="small"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                  {onDeleteTransaction && !showActions && (
                    <IconButton
                      onClick={() => onDeleteTransaction(rowIndex)}
                      size="small"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
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
              {(showActions || onDeleteTransaction) && <TableCell />}
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default TableView;
