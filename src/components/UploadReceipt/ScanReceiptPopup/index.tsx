import { ChangeEvent, FC, useRef, useState } from "react";
import { Category } from "../../shared/types/Category";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import "./ScanReceiptPopup.css";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Checkbox } from "@mui/material";
import { CategorizedProduct } from "../../shared/types/CategorizedProdeuct";
import { ReceiptsApiClient } from "../../../API/Clients/ReceiptsApiClient";
import { ScannedProduct } from "../../shared/types/ScanedProduct";

interface ScanReceiptPopupProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onScanning: (file: File, categorizedProduct: CategorizedProduct[]) => void;
  setFunction: (newList:Category[])=> void;
}

export const ScanReceiptPopup: FC<ScanReceiptPopupProps> = ({
  open,
  onClose,
  categories,
  onScanning,
  setFunction,
}: ScanReceiptPopupProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onCheckBoxClick = (checked: boolean, category: Category) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((el) => el.id !== category.id)
      );
    }
    // setFunction([]);
    // setFunction(selectedCategories);
  };

  const handleClose = () => {
    setFile(undefined);
    onClose();
  };

  const handleScanReceipt = async () => {
    try {
      setIsLoading(true);
      if (file === undefined) return;

      const res = await ReceiptsApiClient.scanReceipt(file, selectedCategories);
      const categorizedProducts: CategorizedProduct[] = res.map(
        (model: any) => {
          return {
            id: model.id,
            name: model.name,
            products: model.products.map(
              (product: any) =>
                ({
                  name: product["name"],
                  quantity: product["quantity"],
                  price: product["price"],
                } as ScannedProduct)
            ),
          };
        }
      );
      onScanning(file, categorizedProducts);

      const uniqueCategories = Array.from(new Set(selectedCategories.map(cat => cat.id)))
        .map(id => selectedCategories.find(cat => cat.id === id) as Category);
      setFunction(uniqueCategories);
      
      setIsLoading(false);
      handleClose();

    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Dialog fullWidth={true} maxWidth={"md"} open={open} onClose={onClose}>
      <DialogTitle fontSize={24}>Upload a receipt</DialogTitle>
      <DialogContent className="scan-receipt-modal-content">
        <Box className="upload-receipt-button-container">
          <Box className="upload-receipt-text"> Upload a receipt </Box>
          <Button
            className=""
            color="primary"
            variant="contained"
            onClick={handleUploadButtonClick}
          >
            <UploadFileIcon color="secondary"></UploadFileIcon>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />
          {file && <Box>Selected file: {file.name}</Box>}
        </Box>
        <Box className="select-categories-container">
          <Box className="select-categories-text">Select categories</Box>
        </Box>
        <Box className="categories-container">
          {categories.map((category: Category, index: number) => (
            <Box key={index} className="category-item">
              <Typography> {category.name}</Typography>
              <Checkbox
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onCheckBoxClick(event.target.checked, category);
                }}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions className="scan-receipt-modal-actions">
        <Button onClick={handleClose} variant="outlined">
          {" "}
          Close
        </Button>
        <Button
          onClick={
            handleScanReceipt
          }
          className="save-button"
          variant="contained"
          color="primary"
          disabled={file === undefined || selectedCategories.length === 0}
        >
          {" "}
          Scan receipt
        </Button>
      </DialogActions>
      {isLoading && (
        <Box className="spinner-layout">
          <CircularProgress />
        </Box>
      )}
    </Dialog>
  );
};