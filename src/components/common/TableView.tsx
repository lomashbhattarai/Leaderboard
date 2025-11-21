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
  Card,
  CardContent,
  Typography,
  Stack,
  useMediaQuery,
  useTheme as useMuiTheme,
  Collapse,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "../../contexts/ThemeContext";
import { getCommonStyles } from "../../themes/commonComponents";
import { useState } from "react";

export interface ColumnConfig {
  label: string;
  key: string;
  align?: "left" | "right" | "center";
  render?: (
    value: any,
    row: any,
    index: number,
    onExpand?: () => void,
    isExpanded?: boolean
  ) => React.ReactNode;
  getValue?: (row: any) => any;
  minWidth?: number;
  sortable?: boolean;
}

// Add view mode types
type ViewMode = "table" | "card";

interface ResponsiveOptions {
  fixedFirstColumn?: boolean;
  minWidth?: number;
  forceViewMode?: ViewMode; // Optional override for view mode
  breakpoint?: number; // Custom breakpoint for switching views (in px)
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
  customCardComponent?: (row: any, index: number) => React.ReactNode;
  renderExpandedRow?: (row: any) => React.ReactNode;
  expansionTriggerColumnKey?: string;
  onSort?: (key: string, order: "asc" | "desc") => void;
  currentSort?: { key: string; order: "asc" | "desc" };
  isCompact?: boolean;
  defaultEmptyMessage?: string;
  rowActions?: (row: any, rowIndex: number) => React.ReactNode;
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
  responsive = {
    fixedFirstColumn: true,
    minWidth: 120,
    breakpoint: 600, // default breakpoint
  },
  customCardComponent,
  renderExpandedRow,
  expansionTriggerColumnKey,
  onSort,
  currentSort,
  isCompact = false,
  defaultEmptyMessage = "No Data found",
  rowActions,
}: TableViewProps) => {
  const { currentTheme } = useTheme();
  const styles = getCommonStyles(currentTheme);
  const muiTheme = useMuiTheme();
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Check if screen is mobile size
  const isMobile = useMediaQuery(`(max-width:${responsive.breakpoint}px)`);

  // Determine view mode
  const viewMode: ViewMode =
    responsive.forceViewMode || (isMobile ? "card" : "table");

  const toggleRow = (rowId: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
  };

  const renderCardView = () => (
    <Stack spacing={isCompact ? 0 : 1}>
      {tableData.map((row, rowIndex) => (
        <Card
          key={row.id || rowIndex}
          sx={{
            backgroundColor: currentTheme.background.secondary,
            borderRadius: 0,
            borderBottom: "0.5px solid #e0e0e0",
          }}
        >
          <CardContent sx={{ p: isCompact ? 1 : 2 }}>
            {customCardComponent ? (
              customCardComponent(row, rowIndex)
            ) : (
              <Stack spacing={isCompact ? 0.5 : 1}>
                {columns.map((column, colIndex) => (
                  <Stack
                    key={colIndex}
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant={isCompact ? "caption" : "body2"}
                      sx={{
                        fontWeight: "bold",
                        minWidth: "40%",
                        color: currentTheme.text.secondary,
                      }}
                    >
                      {column.label}:
                    </Typography>
                    <Typography
                      variant={isCompact ? "caption" : "body2"}
                      align={column.align || "right"}
                      sx={{
                        flex: 1,
                        wordBreak: "break-word",
                        color: currentTheme.text.primary,
                      }}
                    >
                      {column.render
                        ? column.render(
                            column.getValue
                              ? column.getValue(row)
                              : row[column.key],
                            row,
                            rowIndex
                          )
                        : column.getValue
                        ? column.getValue(row)
                        : row[column.key]}
                    </Typography>
                  </Stack>
                ))}

                {rowActions && rowActions(row, rowIndex)}

                {(showActions || onDeleteTransaction) && (
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="flex-end"
                    sx={{ mt: 1 }}
                  >
                    {showActions && (
                      <>
                        <IconButton
                          onClick={() => onEdit?.(row)}
                          size="small"
                          aria-label="edit"
                          sx={{
                            color: currentTheme.accent.primary,
                            padding: isCompact ? "2px" : "4px",
                            "& svg": {
                              fontSize: isCompact ? "1rem" : "1.2rem",
                            },
                            "&:hover": {
                              color: currentTheme.accent.secondary,
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => onDelete?.(row.id)}
                          size="small"
                          aria-label="delete"
                          sx={{
                            color: currentTheme.accent.primary,
                            padding: isCompact ? "2px" : "4px",
                            "& svg": {
                              fontSize: isCompact ? "1rem" : "1.2rem",
                            },
                            "&:hover": {
                              color: currentTheme.accent.secondary,
                            },
                          }}
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
                        sx={{
                          color: currentTheme.accent.primary,
                          "&:hover": {
                            color: currentTheme.accent.secondary,
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                )}
              </Stack>
            )}
          </CardContent>
        </Card>
      ))}
      {showFooter && (
        <Card sx={{ backgroundColor: currentTheme.background.secondary }}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ color: currentTheme.text.primary }}
              >
                Total:
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: currentTheme.text.primary }}
              >
                total X
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {title && (
        <Typography
          variant={isCompact ? "h6" : "h5"}
          sx={{
            mb: isCompact ? 1 : 2,
            color: currentTheme.text.primary,
          }}
        >
          {title}
        </Typography>
      )}
      {tableData.length === 0 ? (
        <>
          {viewMode === "card" ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
                backgroundColor: currentTheme.background.secondary,
                borderRadius: 1,
                p: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: currentTheme.text.secondary,
                  fontSize: isCompact ? "1rem" : "1.25rem",
                }}
              >
                {defaultEmptyMessage}
              </Typography>
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                ...styles.table.container,
                maxWidth: "100%",
                overflowX: "auto",
                position: "relative",
                overflow: "visible",
                backgroundColor: currentTheme.background.secondary,
                "& .MuiTable-root": {
                  borderCollapse: "separate",
                  borderSpacing: "0",
                  minWidth: responsive.fixedFirstColumn
                    ? `${(columns.length - 1) * (responsive.minWidth || 150)}px`
                    : "100%",
                },
                "& .MuiTableCell-root": {
                  ...styles.table.cell,
                  padding: isCompact
                    ? "4px 8px"
                    : { xs: "8px 12px", sm: "16px" },
                  whiteSpace: "nowrap",
                  overflow: "visible",
                  textOverflow: "ellipsis",
                  maxWidth: responsive.minWidth,
                  fontSize: isCompact ? "0.75rem" : "inherit",
                  color: currentTheme.text.primary,
                },
                "& .fixed-column": {
                  position: "sticky",
                  left: 0,
                  backgroundColor: currentTheme.background.secondary,
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    right: -2,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: `linear-gradient(90deg, ${currentTheme.background.primary}, transparent)`,
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
                  backgroundColor: currentTheme.background.primary,
                },
              }}
            >
              <Table size={isCompact ? "small" : "medium"}>
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
                          color: currentTheme.text.primary,
                          zIndex:
                            index === 0 && responsive.fixedFirstColumn ? 3 : 2,
                          minWidth:
                            column.minWidth || responsive.minWidth || 150,
                          cursor: column.sortable ? "pointer" : "default",
                          fontSize: isCompact ? "0.75rem" : "inherit",
                          "&:hover": column.sortable
                            ? {
                                "& .sort-icon": {
                                  opacity: 1,
                                  color: currentTheme.accent.primary,
                                },
                              }
                            : {},
                        }}
                        onClick={() => {
                          if (column.sortable && onSort) {
                            const newOrder =
                              currentSort?.key === column.key &&
                              currentSort.order === "asc"
                                ? "desc"
                                : "asc";
                            onSort(column.key, newOrder);
                          }
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              column.align === "right"
                                ? "flex-end"
                                : "flex-start",
                          }}
                        >
                          {column.label}
                          {column.sortable && (
                            <Box
                              component="span"
                              className="sort-icon"
                              sx={{
                                opacity:
                                  currentSort?.key === column.key ? 1 : 0.3,
                                marginLeft: "4px",
                                transition: "opacity 0.2s",
                              }}
                            >
                              {currentSort?.key === column.key
                                ? currentSort.order === "asc"
                                  ? "↑"
                                  : "↓"
                                : "↕"}
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                    ))}
                    {(showActions || onDeleteTransaction) && (
                      <TableCell sx={{ color: currentTheme.text.primary }}>
                        Actions
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (showActions ? 1 : 0)}
                      align="center"
                      sx={{
                        height: "200px",
                        color: currentTheme.text.secondary,
                        fontSize: isCompact ? "1rem" : "1.25rem",
                        fontWeight: 500,
                      }}
                    >
                      {defaultEmptyMessage}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      ) : viewMode === "card" ? (
        renderCardView()
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            ...styles.table.container,
            maxWidth: "100%",
            overflowX: "auto",
            position: "relative",
            overflow: "visible",
            backgroundColor: currentTheme.background.secondary,
            "& .MuiTable-root": {
              borderCollapse: "separate",
              borderSpacing: "0",
              minWidth: responsive.fixedFirstColumn
                ? `${(columns.length - 1) * (responsive.minWidth || 150)}px`
                : "100%",
            },
            "& .MuiTableCell-root": {
              ...styles.table.cell,
              padding: isCompact ? "4px 8px" : { xs: "8px 12px", sm: "16px" },
              whiteSpace: "nowrap",
              overflow: "visible",
              textOverflow: "ellipsis",
              maxWidth: responsive.minWidth,
              fontSize: isCompact ? "0.75rem" : "inherit",
              color: currentTheme.text.primary,
            },
            "& .fixed-column": {
              position: "sticky",
              left: 0,
              backgroundColor: currentTheme.background.secondary,
              "&::after": {
                content: '""',
                position: "absolute",
                right: -2,
                top: 0,
                bottom: 0,
                width: 4,
                background: `linear-gradient(90deg, ${currentTheme.background.primary}, transparent)`,
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
              backgroundColor: currentTheme.background.primary,
            },
            "& .MuiTableBody-root .MuiTableRow-root": {
              ...styles.table.row,
              "&:hover": {
                backgroundColor: currentTheme.background.primary,
              },
            },
            "& .MuiTableFooter-root .MuiTableRow-root": {
              ...styles.table.footer,
              backgroundColor: currentTheme.background.primary,
            },
            "& .MuiIconButton-root": {
              ...styles.interactive.button,
              padding: "5px",
              marginLeft: "4px",
              color: currentTheme.accent.primary,
              "& svg": {
                fontSize: "1.2rem",
              },
              "&:hover": {
                color: currentTheme.accent.secondary,
              },
            },
            "& .MuiTableRow-root:focus-within": {
              outline: `2px solid ${currentTheme.accent.primary}`,
              outlineOffset: "-2px",
            },
            "& .sort-icon": {
              color: currentTheme.text.secondary,
            },
          }}
        >
          <Table size={isCompact ? "small" : "medium"}>
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
                      color: currentTheme.text.primary,
                      zIndex:
                        index === 0 && responsive.fixedFirstColumn ? 3 : 2,
                      minWidth: column.minWidth || responsive.minWidth || 150,
                      cursor: column.sortable ? "pointer" : "default",
                      fontSize: isCompact ? "0.75rem" : "inherit",
                      "&:hover": column.sortable
                        ? {
                            "& .sort-icon": {
                              opacity: 1,
                              color: currentTheme.accent.primary,
                            },
                          }
                        : {},
                    }}
                    onClick={() => {
                      if (column.sortable && onSort) {
                        const newOrder =
                          currentSort?.key === column.key &&
                          currentSort.order === "asc"
                            ? "desc"
                            : "asc";
                        onSort(column.key, newOrder);
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          column.align === "right" ? "flex-end" : "flex-start",
                      }}
                    >
                      {column.label}
                      {column.sortable && (
                        <Box
                          component="span"
                          className="sort-icon"
                          sx={{
                            opacity: currentSort?.key === column.key ? 1 : 0.3,
                            marginLeft: "4px",
                            transition: "opacity 0.2s",
                          }}
                        >
                          {currentSort?.key === column.key
                            ? currentSort.order === "asc"
                              ? "↑"
                              : "↓"
                            : "↕"}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                ))}
                {(showActions || onDeleteTransaction) && (
                  <TableCell sx={{ color: currentTheme.text.primary }}>
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, rowIndex) => (
                <>
                  <TableRow
                    key={row.id || rowIndex}
                    onMouseEnter={() => setHoveredRow(rowIndex)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={colIndex}
                        align={column.align}
                        className={
                          colIndex === 0 && responsive.fixedFirstColumn
                            ? "fixed-column"
                            : ""
                        }
                        sx={{
                          color: currentTheme.text.primary,
                        }}
                      >
                        {column.render
                          ? column.render(
                              column.getValue
                                ? column.getValue(row)
                                : row[column.key],
                              row,
                              rowIndex,
                              column.key === expansionTriggerColumnKey
                                ? () => toggleRow(row.id)
                                : undefined,
                              expandedRows.has(row.id)
                            )
                          : column.getValue
                          ? column.getValue(row)
                          : row[column.key]}
                      </TableCell>
                    ))}
                    {rowActions && (
                      <TableCell
                        sx={{
                          position: "relative",
                          width: "1%",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {hoveredRow === rowIndex && rowActions(row, rowIndex)}
                      </TableCell>
                    )}
                    {(showActions || onDeleteTransaction) && (
                      <TableCell>
                        {showActions && (
                          <>
                            <IconButton
                              onClick={() => onEdit?.(row)}
                              size="small"
                              aria-label="edit"
                              sx={{
                                color: currentTheme.accent.primary,
                                padding: isCompact ? "2px" : "4px",
                                "& svg": {
                                  fontSize: isCompact ? "1rem" : "1.2rem",
                                },
                                "&:hover": {
                                  color: currentTheme.accent.secondary,
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => onDelete?.(row.id)}
                              size="small"
                              aria-label="delete"
                              sx={{
                                color: currentTheme.accent.primary,
                                padding: isCompact ? "2px" : "4px",
                                "& svg": {
                                  fontSize: isCompact ? "1rem" : "1.2rem",
                                },
                                "&:hover": {
                                  color: currentTheme.accent.secondary,
                                },
                              }}
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
                            sx={{
                              color: currentTheme.accent.primary,
                              "&:hover": {
                                color: currentTheme.accent.secondary,
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                  {renderExpandedRow && expandedRows.has(row.id) && (
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={columns.length + (showActions ? 1 : 0)}
                      >
                        <Collapse in timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>{renderExpandedRow(row)}</Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
            {showFooter && (
              <TableFooter>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    align="right"
                    sx={{ color: currentTheme.text.primary }}
                  >
                    Total:
                  </TableCell>
                  <TableCell sx={{ color: currentTheme.text.primary }}>
                    total X
                  </TableCell>
                  {(showActions || onDeleteTransaction) && <TableCell />}
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TableView;
