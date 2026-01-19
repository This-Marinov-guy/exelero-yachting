import { useAppDispatch } from "@/redux/hooks";
import { setSearchModal } from "@/redux/reducers/LayoutSlice";
import { RouteList } from "@/utils/RouteList";
import { Heart, House, Profile, SearchNormal1 } from "iconsax-react";
import Link from "next/link";
import { FC } from "react";
import { Href } from "../constants";

const MobileMenu: FC<{ part?: string }> = ({ part }) => {
  const dispatch = useAppDispatch();

  return (
    <ul className={`mobile-menu ${part === "car-2"? "dark-mobile-menu" : ""}`}>
      <li className='active'>
        <Link href={RouteList.Home.CarDemo1}>
          <House className='iconsax' />
          <span>Home</span>
        </Link>
      </li>
      <li>
        <Link scroll={false} href={Href} onClick={() => dispatch(setSearchModal())}>
          <SearchNormal1 className='iconsax' />
          <span>Search</span>
        </Link>
      </li>
      <li>
        <Link href={RouteList.Car.CarWishlist}>
          <Heart className='iconsax' />
          <span>Shortlist</span>
        </Link>
      </li>
      <li>
        <Link href={RouteList.Pages.Other.UserDashboard}>
          <Profile className='iconsax' />
          <span>Profile</span>
        </Link>
      </li>
    </ul>
  );
};

export default MobileMenu;
