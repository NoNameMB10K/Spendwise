import { FC, useState, useEffect } from "react";
import "./UpdateCategory.css";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { CategoriesApiClient } from "../../../API/Clients/CategoriesApiClient";
import { CategoryModel } from "../../../API/Models/CategoryModel";
import { Category } from "../../shared/types/Category";

interface UpdateCategoryPopupProps {
  open: boolean;
  onClose: () => void;
  onEditing: (category: Category) => void;
  category: Category | null;
}

export const UpdateCategoryPopup: FC<UpdateCategoryPopupProps> = ({
  open,
  onClose,
  onEditing,
  category,
}: UpdateCategoryPopupProps) => {

  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    }
  }, [category]);

  const updateCategory = async () => {
    if (!category) return;
    const model: CategoryModel = { name: categoryName, id: category.id };

    try {
      const res = await CategoriesApiClient.updateOneAsync(model);
      return res;
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setCategoryName("");
    onClose();
  };

  const handleSave = async () => {
    const categoryModel = await updateCategory();
    const updatedCategory = categoryModel as Category;
    // console.log("Updated category: category model: " + categoryModel?.id +" "+ categoryModel?.name);
    onEditing(updatedCategory);
    handleClose();
  };

  return (
    <Dialog fullWidth={true} maxWidth={"md"} open={open} onClose={onClose}>
      <DialogTitle fontSize={24}>Update Category</DialogTitle>
      <DialogContent className={"update-category-modal-content"}>
        <TextField
          fullWidth
          label="Category Name"
          value={categoryName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCategoryName(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions className={"update-category-modal-actions"}>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!categoryName}
          className="save-button"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
