import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  TrendingUp as BuyIcon,
  TrendingDown as SellIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  StockTransactionWithBalance,
  TransactionType,
  TransactionSummary,
} from "../types/api";
import { format } from "date-fns";
import MaskedAmount from "./common/MaskedAmount";
import MaskedQuantity from "./common/MaskedQuantity";

interface TransactionTimelineProps {
  transactions: StockTransactionWithBalance[];
  summary?: TransactionSummary;
  onEdit?: (transaction: StockTransactionWithBalance) => void;
  onDelete?: (transactionId: number) => void;
  onAddNew?: () => void;
  isLoading?: boolean;
}

const TransactionTimeline: React.FC<TransactionTimelineProps> = ({
  transactions,
  summary,
  onEdit,
  onDelete,
  onAddNew,
  isLoading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isLoading) {
    return <Typography>Loading transactions...</Typography>;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          No transactions found
        </Typography>
        {onAddNew && (
          <Button variant="contained" onClick={onAddNew}>
            Add Transaction
          </Button>
        )}
      </Box>
    );
  }

  // Render mobile card view
  if (isMobile) {
    return (
      <Box>
        {onAddNew && (
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={onAddNew}>
              Add Transaction
            </Button>
          </Box>
        )}

        <Stack spacing={2}>
          {transactions.map((transaction) => (
            <Card
              key={transaction.id}
              variant="outlined"
              sx={{
                borderLeft: 4,
                borderLeftColor:
                  transaction.transactionType === TransactionType.BUY
                    ? "success.main"
                    : "error.main",
              }}
            >
              <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Stack spacing={1.5}>
                  {/* Header with icon and type */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {transaction.transactionType === TransactionType.BUY ? (
                        <BuyIcon color="success" sx={{ fontSize: 20 }} />
                      ) : (
                        <SellIcon color="error" sx={{ fontSize: 20 }} />
                      )}
                      <Box>
                        <Typography
                          variant="subtitle2"
                          component="div"
                          sx={{ lineHeight: 1.3 }}
                        >
                          {transaction.transactionType}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ lineHeight: 1.3 }}
                        >
                          {format(
                            new Date(transaction.transactionDate),
                            "MMM d, yyyy"
                          )}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                      {onEdit && (
                        <IconButton
                          size="small"
                          onClick={() => onEdit(transaction)}
                          color="primary"
                          sx={{ padding: 0.5 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          size="small"
                          onClick={() => onDelete(transaction.id)}
                          color="error"
                          sx={{ padding: 0.5 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>

                  {/* Stock and Portfolio info */}
                  {(transaction.stock ||
                    transaction.portfolioStock?.portfolio) && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      {transaction.stock && (
                        <Chip
                          label={transaction.stock.symbol}
                          size="small"
                          sx={{ height: 24 }}
                        />
                      )}
                      {transaction.portfolioStock?.portfolio && (
                        <Chip
                          label={transaction.portfolioStock.portfolio.name}
                          size="small"
                          variant="outlined"
                          sx={{ height: 24 }}
                        />
                      )}
                    </Stack>
                  )}

                  {/* Transaction details */}
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Qty: <MaskedQuantity value={transaction.quantity} /> ×
                      Rate:{" "}
                      <MaskedAmount
                        value={transaction.price}
                        hideCurrency={true}
                      />
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      Amount:{" "}
                      <MaskedAmount
                        value={transaction.quantity * transaction.price}
                        hideCurrency={true}
                      />
                    </Typography>
                  </Box>

                  {/* Balance info */}
                  <Box sx={{ bgcolor: "action.hover", p: 1, borderRadius: 1 }}>
                    <Stack spacing={0.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">
                          Capital Balance:
                        </Typography>
                        <Typography variant="caption" fontWeight="medium">
                          <MaskedAmount
                            value={transaction.capitalBalance}
                            hideCurrency={true}
                          />
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">
                          Shares Balance:
                        </Typography>
                        <Typography variant="caption" fontWeight="medium">
                          <MaskedQuantity value={transaction.sharesBalance} />
                        </Typography>
                      </Stack>
                      {transaction.transactionPL !== undefined && (
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Transaction P/L:
                          </Typography>
                          <Typography
                            variant="caption"
                            fontWeight="medium"
                            sx={{
                              color:
                                transaction.transactionPL >= 0
                                  ? "success.main"
                                  : "error.main",
                            }}
                          >
                            {transaction.transactionPL >= 0 ? "+" : ""}
                            <MaskedAmount
                              value={transaction.transactionPL}
                              hideCurrency={true}
                            />
                          </Typography>
                        </Stack>
                      )}
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">
                          Cumulative P/L:
                        </Typography>
                        <Typography
                          variant="caption"
                          fontWeight="medium"
                          sx={{
                            color:
                              transaction.realizedPL >= 0
                                ? "success.main"
                                : "error.main",
                          }}
                        >
                          {transaction.realizedPL >= 0 ? "+" : ""}
                          <MaskedAmount
                            value={transaction.realizedPL}
                            hideCurrency={true}
                          />
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>

                  {/* Notes */}
                  {transaction.notes && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      {transaction.notes}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }

  // Render desktop table view
  return (
    <Box>
      {onAddNew && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={onAddNew}>
            Add Transaction
          </Button>
        </Box>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table size="small" sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "action.hover" }}>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Capital Balance</TableCell>
              <TableCell align="right">Shares</TableCell>
              <TableCell align="right">Transaction P/L</TableCell>
              <TableCell align="right">Cumulative P/L</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                sx={{
                  "&:hover": { bgcolor: "action.hover" },
                  borderLeft: 4,
                  borderLeftColor:
                    transaction.transactionType === TransactionType.BUY
                      ? "success.main"
                      : "error.main",
                }}
              >
                <TableCell>
                  <Typography variant="body2">
                    {format(
                      new Date(transaction.transactionDate),
                      "MMM d, yyyy"
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {transaction.transactionType === TransactionType.BUY ? (
                      <BuyIcon color="success" sx={{ fontSize: 16 }} />
                    ) : (
                      <SellIcon color="error" sx={{ fontSize: 16 }} />
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          transaction.transactionType === TransactionType.BUY
                            ? "success.main"
                            : "error.main",
                        fontWeight: "medium",
                      }}
                    >
                      {transaction.transactionType}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Box>
                    {transaction.stock && (
                      <Typography variant="body2" fontWeight="medium">
                        {transaction.stock.symbol}
                      </Typography>
                    )}
                    {transaction.portfolioStock?.portfolio && (
                      <Typography variant="caption" color="text.secondary">
                        {transaction.portfolioStock.portfolio.name}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    <MaskedQuantity value={transaction.quantity} />
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    <MaskedAmount
                      value={transaction.price}
                      hideCurrency={true}
                    />
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium">
                    <MaskedAmount
                      value={transaction.quantity * transaction.price}
                      hideCurrency={true}
                    />
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium">
                    <MaskedAmount
                      value={transaction.capitalBalance}
                      hideCurrency={true}
                    />
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    <MaskedQuantity value={transaction.sharesBalance} />
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {transaction.transactionPL !== undefined ? (
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={{
                        color:
                          transaction.transactionPL >= 0
                            ? "success.main"
                            : "error.main",
                      }}
                    >
                      {transaction.transactionPL >= 0 ? "+" : ""}
                      <MaskedAmount
                        value={transaction.transactionPL}
                        hideCurrency={true}
                      />
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    sx={{
                      color:
                        transaction.realizedPL >= 0
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                    {transaction.realizedPL >= 0 ? "+" : ""}
                    <MaskedAmount
                      value={transaction.realizedPL}
                      hideCurrency={true}
                    />
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={0.5} justifyContent="center">
                    {onEdit && (
                      <IconButton
                        size="small"
                        onClick={() => onEdit(transaction)}
                        color="primary"
                        sx={{ padding: 0.5 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton
                        size="small"
                        onClick={() => onDelete(transaction.id)}
                        color="error"
                        sx={{ padding: 0.5 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionTimeline;
