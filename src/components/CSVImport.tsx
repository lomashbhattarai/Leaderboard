import React, { ChangeEvent, useState } from "react";
import { Button } from "@mui/material";
import CSVModal from "./CSVModal";

interface CSVImportProps {
  handleImport?: (csvData: string[][]) => void;
  handleFileImport?: (file: File) => void;
  label?: string;
  columnsToImport?: string[];
  customColumn?: {
    name: string;
    render: (rowData: string[], tableData: string[][]) => string;
  };
}

const CSVImport: React.FC<CSVImportProps> = ({
  handleImport,
  handleFileImport,
  label = "Import CSV",
  columnsToImport,
  customColumn,
}) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split("\n");
        const parsedData = lines.map((line) => line.split(","));
        const cleanedData = parsedData.map((row) =>
          row.map((cell) => cell.replace(/^"(.*)"$/, "$1"))
        );

        if (
          columnsToImport &&
          columnsToImport.length > 0 &&
          cleanedData.length > 0
        ) {
          const headers = cleanedData[0];
          const columnIndices = columnsToImport
            .map((col) => headers.indexOf(col))
            .filter((index) => index !== -1);

          const filteredData = cleanedData.map((row) =>
            columnIndices.map((index) => row[index])
          );
          setCsvData(filteredData);
        } else {
          setCsvData(cleanedData);
        }
        setIsModalOpen(true);
      };
      reader.readAsText(file);
    }
  };

  const onImport = () => {
    handleImport?.(csvData);
    if (csvFile) {
      handleFileImport?.(csvFile);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <input
        accept=".csv"
        style={{ display: "none" }}
        id="raised-button-file"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span">
          {label}
        </Button>
      </label>
      <CSVModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={csvData}
        onImport={onImport}
        customColumn={customColumn}
      />
    </div>
  );
};

export default CSVImport;
