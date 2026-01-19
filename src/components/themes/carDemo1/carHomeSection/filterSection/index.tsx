import SearchTabList from "@/components/themes/common/SearchTabList";
import { GifPath, Href } from "@/constants";
import Image from "next/image";
import Link from "next/link";

const CarHomeFilter = () => {
  return (
    <div className='property-home-tab car-home-tab'>
      <div className='car-tab-flex'>
        <SearchTabList showTab={[1, 2, 5, 6]} endPoint={2} pills />
        <Link scroll={false} href={Href} className='scroll-down tab-item'>
            <Image width={83} height={99} src={`${GifPath}/mouse-animation.gif`} unoptimized alt='mouse-animation' className='img-fluid' />
        </Link>
      </div>
    </div>
  );
}; 

export default CarHomeFilter;
