import { useAppDispatch } from "@/redux/hooks";
import { setCartData, setSearchModal } from "@/redux/reducers/LayoutSlice";
import { RouteList } from "@/utils/RouteList";
import { Heart, Home, Menu, User, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { Href } from "../constants";

const MobileMenu: FC<{ part?: string }> = ({ part }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isBoatsPage = pathname === RouteList.Pages.Boats;

  return (
    <ul className={`mobile-menu ${part === "car-2"? "dark-mobile-menu" : ""}`}>
      <li className='active'>
        <Link href={RouteList.Home.CarDemo1}>
          <Home className='iconsax' />
          <span>Home</span>
        </Link>
      </li>
      <li>
        <Link
          scroll={false}
          href={isBoatsPage ? Href : RouteList.Pages.Boats}
          onClick={(e) => {
            if (!isBoatsPage) return;
            e.preventDefault();
            dispatch(setSearchModal());
          }}
        >
          <Search className='iconsax' />
          <span>Search</span>
        </Link>
      </li>
      {/* <li>
        <Link href={RouteList.Car.CarWishlist}>
          <Heart className='iconsax' />
          <span>Shortlist</span>
        </Link>
      </li>
      <li>
        <Link href={RouteList.Pages.Other.UserDashboard}>
          <User className='iconsax' />
          <span>Profile</span>
        </Link>
      </li> */}
      <li>
        <Link scroll={false} href={Href} onClick={() => dispatch(setCartData())}>
          <Menu className='iconsax' />
          <span>Menu</span>
        </Link>
      </li>
    </ul>
  );
};

export default MobileMenu;
