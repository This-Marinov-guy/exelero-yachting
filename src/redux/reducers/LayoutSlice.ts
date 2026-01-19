import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: false,
  openFilterSidebar: false,
  totalProduct: 0,
  cardToShow: 6,
  searchModal: false,
  mapModal: false,
  shareModal: false,
  videoModal: false,
  reviewModal: false,
  testDriverModal: false,
  offerPriceModal: false,
  UserDashboardSidebar: false,
  activeTab: "dashboard",
  logoutModal: false,
  moreDetailModal: false,   
  personInfoModal: false,
  addressModal: false,
  loginModal:true,
  signUpModal: false,
  scrollActive: '',
};

const LayoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setCartData: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setOpenFilterSidebar: (state) => {
      state.openFilterSidebar = !state.openFilterSidebar;
    },
    setSidebarOpen: (state,action) => {
      state.sidebarOpen = action.payload;
    },
    setTotalProduct: (state, action) => {
      state.totalProduct = action.payload;
    },
    setCardToShow: (state, action) => {
      state.cardToShow = action.payload;
    },
    setSearchModal: (state) => {
      state.searchModal = !state.searchModal;
    },
    setMapModal: (state) => {
      state.mapModal = !state.mapModal;
    },
    setShareModal: (state) => {
      state.shareModal = !state.shareModal;
    },
    setVideoModal: (state) => {
      state.videoModal = !state.videoModal;
    },
    setReviewModal: (state) => {
      state.reviewModal = !state.reviewModal;
    },
    setTestDriverModal: (state) => {
      state.testDriverModal = !state.testDriverModal;
    },
    setOfferPriceModal: (state) => {
      state.offerPriceModal = !state.offerPriceModal;
    },
    setUserDashboardSidebar: (state) => {
      state.UserDashboardSidebar = !state.UserDashboardSidebar;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setLogoutModal: (state) => {
      state.logoutModal = !state.logoutModal;
    },
    setMoreDetailModal: (state) => {
      state.moreDetailModal = !state.moreDetailModal;
    },
    setPersonInfoModal: (state) => {
      state.personInfoModal = !state.personInfoModal;
    },
    setAddressModal: (state) => {
      state.addressModal = !state.addressModal;
    },
    setLoginModal: (state) => {
      state.loginModal =!state.loginModal;
    },
    setSignUpModal: (state) => {
      state.signUpModal = !state.signUpModal;
    },
    setScrollActive: (state, action) => {
      state.scrollActive = action.payload;
    },
  },
});

export const {setScrollActive, setSignUpModal, setCartData, setTotalProduct, setOpenFilterSidebar, setSidebarOpen, setCardToShow, setSearchModal, setMapModal, setShareModal, setVideoModal, setReviewModal, setTestDriverModal, setOfferPriceModal, setActiveTab, setUserDashboardSidebar, setLogoutModal, setMoreDetailModal, setPersonInfoModal, setAddressModal,setLoginModal } = LayoutSlice.actions;
export default LayoutSlice.reducer;
