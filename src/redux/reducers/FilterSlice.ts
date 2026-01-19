import { FilterSliceType } from "@/types/Product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: FilterSliceType = {
  propertyType: [],
  priceStatus: [40000, 500000],
  bedsRooms: [],
  sortBy: null,
  popular: null,
  squareFeetStatus: [400, 4000],
  yearBuiltStatus: [2019, 2024],
  amenities: [],
  carBrandModel: [],
  minAndMaxPrice: [],
  budgetStatus: [50000, 400000],
  categories: "",
  fuelType: [],
  modelYear: "",
  seats: [],
  color: [],
  kmsDriven: [10000, 45000],
  minAndMaxKilometers: [],
  carTransmissions: [],
  ownerDetail: [],
  jobAllCategory: [],
  minAndMaxSalary: [],
  salaryStatus: [25, 60],
  JobWorkMode: "",
  JobCompanyType: [],
  JobEducation: [],
  JobCheck: [],
  JobLocation: [],
  JobTopCompanies: [],
  JobType: [],
};

const FiltersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setPropertyType(state, action) {
      state.propertyType = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setBedsRooms: (state, action) => {
      state.bedsRooms = action.payload;
    },
    setPopular: (state, action) => {
      state.popular = action.payload;
    },
    setPriceStatus: (state, action) => {
      action.payload ? (state.priceStatus = [...action.payload]) : state.priceStatus.splice(0, state.priceStatus.length);
    },
    setSquareFeetStatus: (state, action) => {
      action.payload ? (state.squareFeetStatus = [...action.payload]) : state.squareFeetStatus.splice(0, state.squareFeetStatus.length);
    },
    setYearBuiltStatus: (state, action) => {
      action.payload ? (state.yearBuiltStatus = [...action.payload]) : state.yearBuiltStatus.splice(0, state.yearBuiltStatus.length);
    },
    setAmenities: (state, action) => {
      state.amenities = action.payload;
    },
    setCarBrandModel: (state, action) => {
      state.carBrandModel = action.payload;
    },
    setMinAndMaxPrice: (state, action) => {
      state.minAndMaxPrice = action.payload;
    },
    setBudgetStatus: (state, action) => {
      state.budgetStatus = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setFuelType: (state, action) => {
      state.fuelType = action.payload;
    },
    setModelYear: (state, action) => {
      state.modelYear = action.payload;
    },
    setSeats: (state, action) => {
      state.seats = action.payload;
    },
    setColor: (state, action) => {
      state.color = action.payload;
    },
    setKmsDriven: (state, action) => {
      state.kmsDriven = action.payload;
    },
    setMinAndMaxKilometers: (state, action) => {
      state.minAndMaxKilometers = action.payload;
    },
    setTransmissions: (state, action) => {
      state.carTransmissions = action.payload;
    },
    setOwner: (state, action) => {
      state.ownerDetail = action.payload;
    },
    setJobAllCategory: (state, action) => {
      state.jobAllCategory = action.payload;
    },
    setMinAndMaxSalary: (state, action) => {
      state.minAndMaxSalary = action.payload;
    },
    setSalaryStatus: (state, action) => {
      state.salaryStatus = action.payload;
    },
    setJobWorkMode: (state, action) => {
      state.JobWorkMode = action.payload;
    },
    setJobCompanyType: (state, action) => {
      state.JobCompanyType = action.payload;
    },
    setJobEducation: (state, action) => {
      state.JobEducation = action.payload;
    },
    setJobByCheck: (state, action) => {
      state.JobCheck = action.payload;
    },
    setJobLocation: (state, action) => {
      state.JobLocation = action.payload;
    },
    setJobTopCompanies: (state, action) => {
      state.JobTopCompanies = action.payload;
    },
    setJobType: (state, action) => {
      state.JobType = action.payload;
    },
    removeFilter: (state, action: PayloadAction<{ label: string; value: any }>) => {
      const { label, value } = action.payload;
    
      if (Array.isArray(state[label])) {
        state[label] = state[label].filter((item: any) => item !== value);
      } 
      else {
        state[label] = "";
      }
    },
    clearAllFilters: (state: any) => {
      Object.keys(state).forEach((key) => {
        if (Array.isArray(state[key])) {
          if (key === "salaryStatus") {
            return (state[key] = state.salaryStatus);
          }
          if (key === "minAndMaxSalary") {
            return (state[key] = state.minAndMaxSalary);
          }
          state[key] = [];
        } else {
          state[key] = "";
        }
      });
    },
  },
});

export const { setPropertyType, setSortBy, setPopular, setPriceStatus, setBedsRooms, setSquareFeetStatus, setYearBuiltStatus, setAmenities, setCarBrandModel, setMinAndMaxPrice, setBudgetStatus, setCategories, setFuelType, setModelYear, setSeats, setColor, setKmsDriven, setMinAndMaxKilometers, setTransmissions, setOwner, setJobAllCategory, setMinAndMaxSalary, setSalaryStatus, setJobWorkMode, setJobCompanyType, setJobEducation, setJobByCheck, setJobLocation, setJobTopCompanies, setJobType, removeFilter, clearAllFilters } = FiltersSlice.actions;

export default FiltersSlice.reducer;
