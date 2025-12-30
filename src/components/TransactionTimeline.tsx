import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import {
  TrendingUp as BuyIcon,
  TrendingDown as SellIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { StockTransaction, TransactionType } from "../types/api";
import { formatAmount } from "../utils/helper";
import { format } from "date-fns";

interface TransactionTimelineProps {
  transactions: StockTransaction[];
  onEdit?: (transaction: StockTransaction) => void;
  onDelete?: (transactionId: number) => void;
  onAddNew?: () => void;
  isLoading?: boolean;
}

const TransactionTimeline: React.FC<TransactionTimelineProps> = ({
  transactions,
  onEdit,
  onDelete,
  onAddNew,
  isLoading = false,
}) => {
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
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                {/* Left side: Icon, Type, Date */}
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ minWidth: 0 }}
                >
                  {transaction.transactionType === TransactionType.BUY ? (
                    <BuyIcon color="success" sx={{ fontSize: 20 }} />
                  ) : (
                    <SellIcon color="error" sx={{ fontSize: 20 }} />
                  )}
                  <Box sx={{ minWidth: 0 }}>
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

                {/* Middle: Portfolio chip and notes */}
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  {transaction.portfolioStock?.portfolio && (
                    <Chip
                      label={transaction.portfolioStock.portfolio.name}
                      size="small"
                      sx={{ height: 24 }}
                    />
                  )}
                  {transaction.notes && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {transaction.notes}
                    </Typography>
                  )}
                </Stack>

                {/* Right side: Transaction details and action buttons */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary">
                      Qty: {transaction.quantity}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={{ lineHeight: 1.3 }}
                    >
                      {formatAmount(transaction.price, true)} ×{" "}
                      {transaction.quantity} ={" "}
                      {formatAmount(
                        transaction.quantity * transaction.price,
                        true
                      )}
                    </Typography>
                  </Box>

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
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default TransactionTimeline;
