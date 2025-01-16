import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface CSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: string[][];
  onImport: () => void;
  customColumn?: {
    name: string;
    render: (rowData: string[], tableData: string[][]) => string;
  };
}

const CSVModal: React.FC<CSVModalProps> = ({
  isOpen,
  onClose,
  data,
  onImport,
  customColumn,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>CSV Data Preview</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {data[0]?.map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
                {customColumn && <TableCell>{customColumn.name}</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(1).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                  {customColumn && (
                    <TableCell>{customColumn.render(row, data)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onImport} variant="contained" color="primary">
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CSVModal;
