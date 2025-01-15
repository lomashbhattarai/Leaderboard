import React, { ChangeEvent, useState } from "react";
import { Button } from "@mui/material";
import CSVModal from "./CSVModal";

interface CSVImportProps {
  handleImport: (csvData: string[][]) => void;
  label?: string;
}

const CSVImport: React.FC<CSVImportProps> = ({
  handleImport,
  label = "Import CSV",
}) => {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split("\n");
        const parsedData = lines.map((line) => line.split(","));
        setCsvData(parsedData);
        setIsModalOpen(true);
      };
      reader.readAsText(file);
    }
  };

  const onImport = () => {
    handleImport(csvData);
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
      />
    </div>
  );
};

export default CSVImport;
