import { useAppDispatch } from "@/redux/hooks";
import { setCartData, setSearchModal } from "@/redux/reducers/LayoutSlice";
import { RouteList } from "@/utils/RouteList";
import { Home, Menu, Search } from "lucide-react";
import Link from "@/components/commonComponents/LocalizedLink";
import { usePublicText } from "@/lib/usePublicText";
import { stripLocale } from "@/lib/publicLocale";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { Href } from "../constants";

const MobileMenu: FC<{ part?: string }> = ({ part }) => {
  const tr = usePublicText();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isBoatsPage = stripLocale(pathname || "") === RouteList.Pages.Boats;

  return (
    <ul className={`mobile-menu ${part === "car-2"? "dark-mobile-menu" : ""}`}>
      <li className='active'>
        <Link href={RouteList.Home.CarDemo1}>
          <Home className='iconsax' />
          <span>{tr("Home")}</span>
        </Link>
      </li>
      <li>
        <Link
          scroll={!isBoatsPage}
          href={isBoatsPage ? Href : RouteList.Pages.Boats}
          onClick={(e) => {
            if (!isBoatsPage) return;
            e.preventDefault();
            dispatch(setSearchModal());
          }}
        >
          <Search className='iconsax' />
          <span>{tr("Search")}</span>
        </Link>
      </li>
      <li>
        <Link scroll={false} href={Href} onClick={() => dispatch(setCartData())}>
          <Menu className='iconsax' />
          <span>{tr("Menu")}</span>
        </Link>
      </li>
    </ul>
  );
};

export default MobileMenu;
