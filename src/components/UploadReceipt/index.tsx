import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import { Category } from "../shared/types/Category";
import { ScanReceiptPopup } from "./ScanReceiptPopup";
import "./UploadReceipt.css";
import { useNavigate } from "react-router-dom";
import { CategoryModel } from "../../API/Models/CategoryModel";
import { CategorizedProduct } from "../shared/types/CategorizedProdeuct";
import { CategoriesApiClient } from "../../API/Clients/CategoriesApiClient";
import { SaveCartModel } from "../../API/Models/SaveCartModel";
import { CategorizedProductModel } from "../../API/Models/CategorizedProductModel";
import { ReceiptsApiClient } from "../../API/Clients/ReceiptsApiClient";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { ScannedProduct } from "../shared/types/ScanedProduct";
import { SwapCategoryPopup } from "./SwapCategoryPopup";

export const UploadReceipt: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSetupComplete, setIsSetupComplete] = useState(false); 
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setCategoriesSelected([]);
  }
  const handleClose = () => setOpen(false);
  const [scannedImage, setScannedImage] = useState<File | null>(null);
  const [categorizedProducts, setCategorizedProducts] = useState<
    CategorizedProduct[]
  >([]);

  const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([]);

  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState<ScannedProduct | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await CategoriesApiClient.getAllAsync();
      const categories = res.map((e: CategoryModel) => ({ ...e } as Category));
      setCategories(categories);
      setIsSetupComplete(true);
    } catch (error: any) {
      console.log(error);
    }
  };

  const saveProductsInReceipt = async () => {
    try {
      const model: SaveCartModel = {
        date: new Date(),
        categoryProducts: categorizedProducts.map(
          (el) => ({ ...el } as CategorizedProductModel)
        ),
      };
      const res = await ReceiptsApiClient.saveCart(model);
      navigate("/products");
    } catch (error: any) {
      console.log(error);
    }
  };


  const handleEditing = (product: ScannedProduct, index: number, newCategories: Category[]) => {
    const oldCategory = categorizedProducts.find(category =>
      category.products.some(prod => prod.name === product.name)
    );
    const category = categorizedProducts.find(cat => cat.id === newCategories[0].id);

    // console.log("prod name: " + product.name + " category:" + newCategories[0].name);

    if (oldCategory) {
      const occurrencesCount = oldCategory.products.reduce((count, prod) => {
          if (prod.name === product.name) {
              return count + 1;
          }
          return count;
      }, 0);
      oldCategory.products = oldCategory.products.filter(prod => prod.name !== product.name);

      for (let i = 0; i < occurrencesCount; i++) {
        if (category) {
          category.products.push(product);
        }
      }

    }
    setSelectedProduct(null);
    setSelectedIndex(null);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, categoriesSelected);

  return !isSetupComplete ? (
    <Box className={"spinner-layout"}>
      <CircularProgress />
    </Box>
  ) : (
    <Box>
      <Box className={"upload-receipt-section"}>
        <Box className={"upload-receipt-title-text"}>Upload a receipt</Box>
        <Button
          size="medium"
          color="primary"
          variant="contained"
          onClick={handleOpen}
        >
          <UploadIcon fontSize="large" color="secondary" />
        </Button>
      </Box>

      <Divider />

      {scannedImage && (
        <>
          <Box className={"uploaded-image-section"}>
            <Box>
              <Box className={"uploaded-image-container"}>
                <Box
                  className={"upload-receipt-title-text"}
                  textAlign={"center"}
                >
                  Uploaded image 
                </Box>
                <img
                  src={URL.createObjectURL(scannedImage)}
                  className={"uploaded-image"}
                />
              </Box>
            </Box>
            <Box className={"categorized-products-section"}>
              <Box className={"upload-receipt-title-text"}>
                Categorized Products
              </Box>
              <Button
                onClick={() => saveProductsInReceipt()}
                variant="contained"
                className={"save-products-button"}
              >
                Save products
              </Button>
              {categorizedProducts.map((category) => (
                <Box key={category.id} className={"category-box"}>
                  <Typography variant="h6" className={"category-name"}>
                    {category.name}
                  </Typography>
                  <Box className={"products-list"}>
                    {category.products.map((product, index) => (
                      <Box key={index} className={"product-box"}>
                        <Typography className={"product-name"}>
                          {product.name}
                        </Typography>
                        <Typography className={"product-quantity"}>
                          Quantity: {product.quantity}
                        </Typography>
                        <Typography className={"product-price"}>
                          Price: ${product.price.toFixed(2)}

                          <IconButton 
                            onClick={() =>{
                              setSelectedProduct(product);
                              setSelectedIndex(index);
                            }} className="swap-category-button"
                          >
                            <ChangeCircleIcon color="primary" fontSize="large" className="swap-category-button"/>
                          </IconButton>

                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      )}
      <ScanReceiptPopup
        open={open}
        onClose={handleClose}
        categories={categories}
        onScanning={(file: File, categorizedProducts: CategorizedProduct[]) => {
          setScannedImage(file);
          setCategorizedProducts(categorizedProducts);
        }}
        setFunction= {setCategoriesSelected}
      />

      <SwapCategoryPopup
        open={Boolean(selectedProduct) || Boolean(selectedIndex)}
        onClose={() => {
          setSelectedProduct(null);
          setSelectedIndex(null);
        }}
        onEditing={handleEditing} // Modified
        product={selectedProduct}
        id={selectedIndex}
        categories={categoriesSelected}
      />
    </Box>
  );
};