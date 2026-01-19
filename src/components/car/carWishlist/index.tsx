"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import WishListContent from "@/components/property/propertyWishlist/WishlistContent";
import { RouteList } from "@/utils/RouteList";

const CarWishlistContainer = () => {   
  return (
    <>
      <Breadcrumbs mainClass='car-breadcrumbs-section' title='Car Wishlist' url={RouteList.Home.CarDemo1} />
      <WishListContent type='car' />
    </>
  );
};

export default CarWishlistContainer;
