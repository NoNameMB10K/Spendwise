import { ChangeEvent, FC, useState, useEffect } from "react";
import { ScannedProduct } from "../../shared/types/ScanedProduct";
import { Category } from "../../shared/types/Category";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

interface SwapCategoryPopupProps {
  open: boolean;
  onClose: () => void;
  onEditing: (product: ScannedProduct, id: number, categories: Category[]) => void;
  product: ScannedProduct | null;
  id: number | null;
  categories: Category[];
}

export const SwapCategoryPopup: FC<SwapCategoryPopupProps> = ({
  open,
  onClose,
  onEditing,
  product,
  id,
  categories,
}) => {

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!open) {
      setSelectedCategories([]);
    }
  }, [open]);

  const onCheckBoxClick = (checked: boolean, category: Category) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((el) => el.id !== category.id)
      );
    }
  };

  const handleUpdate = () => {
    if (product && id !== null && selectedCategories.length === 1) {
      onEditing(product, id, selectedCategories);
      setSelectedCategories([]); // Reset the selected categories
      onClose(); // Close the dialog after updating
    }
  };

  return (
    <Dialog fullWidth={true} maxWidth={"md"} open={open} onClose={onClose}>
      <DialogTitle fontSize={18}>Update category for {product?.name}</DialogTitle>

      <DialogContent className="scan-receipt-modal-content">
        <Box className="select-categories-container">
          <Box className="select-categories-text">Select correct category</Box>
        </Box>
        <Box className="categories-container">
          {categories.map((category: Category, index: number) => (
            <Box key={index} className="category-item">
              <Typography> {category.name}</Typography>
              <Checkbox
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onCheckBoxClick(event.target.checked, category);
                }}
                checked={selectedCategories.some((el) => el.id === category.id)}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions className="scan-receipt-modal-actions">
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button
          onClick={handleUpdate}
          className="save-button"
          variant="contained"
          color="primary"
          disabled={selectedCategories.length !== 1}
        >
          Update category
        </Button>
      </DialogActions>
    </Dialog>
  );
};