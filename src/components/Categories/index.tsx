import { Box, Button, Divider, IconButton } from "@mui/material";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import AddIcon from "@mui/icons-material/Add";
import { FC, useEffect, useState } from "react";
import { Category } from "../shared/types/Category";
import CancelIcon from "@mui/icons-material/Cancel";
import { CategoriesApiClient } from "../../API/Clients/CategoriesApiClient";
import { CategoryModel } from "../../API/Models/CategoryModel";

import "./Categories.css";
import { AddCategoryPopup } from "./AddCategoryPopup";
import { UpdateCategoryPopup } from "./UpdateCategoryPopup";

export const Categories: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchCategories = async () => {
    try {
      const res = await CategoriesApiClient.getAllAsync();
      const categories = res.map((e: CategoryModel) => ({ ...e } as Category));
      setCategories(categories);
    } catch (error: any) {
      console.log(error);
    }
  };

  const deleteCategory = async (id?: number) => {
    if (!id) return;

    try {
      await CategoriesApiClient.deleteOneAsync(id);

      const newCategories = categories.filter((el) => el.id !== id);
      setCategories(newCategories);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Box>
      <Box className={"new-category-section"}>
        <Box className={"categories-title-text"}>Add a new category</Box>
        <Button
          size="medium"
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ color: "#fff" }}
        >
          <AddIcon fontSize="large" />
        </Button>
      </Box>

      <Divider />

      <Box className={"categories-list-section"}>
        <Box className={"categories-title-text"}>Current categories</Box>
        <Box className={"categories-list"}>
          {categories.map((category: Category, index: number) => (
            <Box key={`${category.id}-${index}`} className={"category"}>
              <Box className={"category-text-container"}>{category.name}</Box>

              <IconButton
                onClick={() => {
                  setSelectedCategory(category);
                }}
              >
                <ChangeCircleIcon color="primary" fontSize="large" />
              </IconButton>
              
              <IconButton onClick={() => deleteCategory(category.id)}>
                <CancelIcon color="primary" fontSize="large" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>

      <AddCategoryPopup
        open={open}
        onClose={handleClose}
        onEditing={(category: Category) => {
          setCategories([...categories, category]);
        }}
      />

    <UpdateCategoryPopup
      open={Boolean(selectedCategory)}
      onClose={() => setSelectedCategory(null)}
      onEditing={(updatedCategory: Category) => {
        const newCategories = categories.map(cat => 
          cat.id === updatedCategory.id ? updatedCategory : cat
        );
        setCategories(newCategories);
        setSelectedCategory(null);
      }}
      category={selectedCategory}
    />

    </Box>
  );
};
