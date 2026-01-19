"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { useAppDispatch } from "@/redux/hooks";
import { fetchProductApiData } from "@/redux/reducers/ProductSlice";
import { RouteList } from "@/utils/RouteList";
import { useEffect } from "react";
import WishListContent from "./WishlistContent";

const PropertyWishlistContainer = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProductApiData());
  }, [dispatch]);

  return (
    <>
      <Breadcrumbs title='Wishlist' url={RouteList.Home.PropertyDemo1} />
      <WishListContent type='property' />
    </>
  );
};

export default PropertyWishlistContainer;
