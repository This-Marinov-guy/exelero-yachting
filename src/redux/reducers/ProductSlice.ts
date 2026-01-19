import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { CategoryType, ProductSliceProp, ProductType } from "../../types/Product";

const initialState: ProductSliceProp = {
  productItem: [],
  categoryItem: [],
};

export const fetchProductApiData = createAsyncThunk<ProductType[], void, {}>("/api/products", async () => {
  const response = await axios.get("/api/products");
  return response.data;
});

export const fetchCategoryApiData = createAsyncThunk<CategoryType[], void, {}>("/api/categories", async () => {
  const response = await axios.get("/api/categories");
  return response.data;
});

const ProductSlice = createSlice({
  name: "Product",
  initialState,
  reducers: {
    deleteProduct: (state, action) => {
      state.productItem = state.productItem.filter((product) => product.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductApiData.fulfilled, (state, action) => {
      state.productItem = action.payload;
    });
    builder.addCase(fetchCategoryApiData.fulfilled, (state, action) => {
      state.categoryItem = action.payload;
    });
  },
});

export const {deleteProduct} = ProductSlice.actions;
export default ProductSlice.reducer;
