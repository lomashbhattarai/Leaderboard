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
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "../../contexts/ThemeContext";
import { getCommonStyles } from "../../themes/commonComponents";

export interface ColumnConfig {
  label: string;
  key: string;
  align?: "left" | "right" | "center";
  render?: (value: any, row: any) => React.ReactNode;
  getValue?: (row: any) => any;
}

interface ResponsiveOptions {
  fixedFirstColumn?: boolean;
  minWidth?: number;
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
  responsive?: ResponsiveOptions;
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
  responsive = { fixedFirstColumn: true, minWidth: 150 },
}: TableViewProps) => {
  const { currentTheme } = useTheme();
  const styles = getCommonStyles(currentTheme);

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {title && <h2>{title}</h2>}
      <TableContainer
        component={Paper}
        sx={{
          ...styles.table.container,
          maxWidth: "100%",
          overflowX: "auto",
          position: "relative",
          "& .MuiTable-root": {
            borderCollapse: "separate",
            borderSpacing: "0",
            minWidth: responsive.fixedFirstColumn
              ? `${(columns.length - 1) * (responsive.minWidth || 150)}px`
              : "100%",
          },
          "& .MuiTableCell-root": {
            ...styles.table.cell,
            padding: { xs: "8px 12px", sm: "16px" },
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: responsive.minWidth,
          },
          "& .fixed-column": {
            position: "sticky",
            left: 0,
            backgroundColor: currentTheme.background.primary,
            "&::after": {
              content: '""',
              position: "absolute",
              right: -2,
              top: 0,
              bottom: 0,
              width: 4,
              background: `linear-gradient(90deg, rgba(0,0,0,0.1), transparent)`,
            },
            zIndex: 1,
          },
          "& .MuiTableHead-root": {
            position: "sticky",
            top: 0,
            zIndex: 2,
          },
          "& .MuiTableHead-root .MuiTableRow-root": {
            ...styles.table.header,
          },
          "& .MuiTableBody-root .MuiTableRow-root": {
            ...styles.table.row,
          },
          "& .MuiTableFooter-root .MuiTableRow-root": {
            ...styles.table.footer,
          },
          "& .MuiIconButton-root": {
            ...styles.interactive.button,
            padding: "4px",
            marginLeft: "4px",
          },
          "& .MuiTableRow-root:focus-within": {
            outline: `2px solid ${currentTheme.accent.secondary}`,
            outlineOffset: "-2px",
          },
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.align}
                  className={
                    index === 0 && responsive.fixedFirstColumn
                      ? "fixed-column"
                      : ""
                  }
                  sx={{
                    backgroundColor: currentTheme.background.primary,
                    zIndex: index === 0 && responsive.fixedFirstColumn ? 3 : 2,
                  }}
                >
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
                  <TableCell
                    key={colIndex}
                    align={column.align}
                    className={
                      colIndex === 0 && responsive.fixedFirstColumn
                        ? "fixed-column"
                        : ""
                    }
                  >
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
    </Box>
  );
};

export default TableView;
