import { Href, ImagePath, ShowMore, SVGPath } from "@/constants";
import { useEffect, useRef } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductSwiperSetting } from "@/data/demo/demo1";
import { ProductCardType } from "@/types/Product";
import RatioImage from "@/utils/RatioImage";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import { Label } from "reactstrap";
import { Trash } from "iconsax-react";
import { useAppDispatch } from "@/redux/hooks";
import { deleteProduct } from "@/redux/reducers/ProductSlice";
import toast from "react-hot-toast";

const CarProductBox1: React.FC<ProductCardType> = ({ data, gridType, view, wishlist,carId }) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const dispatch = useAppDispatch();
  const handleDelete = (id: number) => {
    dispatch(deleteProduct(id));
    toast.success("Car successfully Removed !");
  };
  const singleImage = data.image.slice(0, 1).map((img) => {
    return img;
  });
  useEffect(() => {
    if (swiperRef.current) swiperRef.current.init();
  }, []);

  return (
    <article className='featured-box'>
      <div className='featured-main-img'>
        <Link href={RouteList.Car.Detail.CarClassic} className='featured-img'>
          {view === "noslider" ? (
            <RatioImage src={`${ImagePath}/${singleImage}`} alt='featured-img' className='img-fluid bg-img' />
          ) : (
            <Swiper {...ProductSwiperSetting} onInit={(swiper: SwiperType) => (swiperRef.current = swiper)}>
              {data.image.map((testimonial, index) => (
                <SwiperSlide key={index} className='bg-size'>
                  <RatioImage src={`${ImagePath}/${testimonial}`} alt='featured-img' className='img-fluid bg-img' />
                </SwiperSlide>
              ))}
              <div className='swiper-button-next' />
              <div className='swiper-button-prev' />
            </Swiper>
          )}
        </Link>
        {wishlist ? (
          <Link scroll={false} href={Href} className='remove-button' onClick={() => carId && handleDelete(carId)}>
            <Trash className='iconsax'/>
          </Link>
        ) : (
          <Link scroll={false} href={Href} className='save-btn' onClick={() => {toast.success("Car successfully Added in Wishlist !")}}>
            <i className='ri-bookmark-line' />
          </Link>
        )}
        {data.label && (
          <Label className={data.label.class}>
            <i className={data.label.icon} />
            {data.label.text}
          </Label>
        )}
      </div>
      <div className='featured-content'>
        <Link href={RouteList.Car.Detail.CarClassic}>{data.title}</Link>
        {gridType === "list-view" && <p className='featured-detail'>{data.description}</p>}
        <p>{data.emi}</p>
        <ul className='featured-list'>
          {data.features.slice(0,3).map((item, index) => (
            <li key={index}>
              <Image height={16} width={16} src={`${SVGPath}/${item.icon}`} alt='profile-2user' className='img-fluid' />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
        <div className='featured-price'>
          <h5>${data.price}</h5>
          <Link href={RouteList.Car.Detail.CarClassic} className='arrow-btn'>
            {ShowMore} <i className='ri-arrow-right-up-line' />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CarProductBox1;
