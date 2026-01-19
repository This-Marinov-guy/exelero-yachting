import Pagination from "@/components/commonComponents/gridView/filter/Pagination";
import { BlogData } from "@/data/pages";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCardToShow } from "@/redux/reducers/LayoutSlice";
import { BlogGridViewType } from "@/types/CommonComponents";
import { FC, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
import { Gallery } from "react-photoswipe-gallery";
import { Button } from "reactstrap";
import BlogGridCard from "./BlogGridCard";
import BlogTitleBox from "./BlogTitlePage";

const BlogDetailBox: FC<BlogGridViewType> = ({ type, gridSize }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { cardToShow } = useAppSelector(state => state.layout);
  const totalPages = Math.ceil(BlogData.length / cardToShow);
  const dispatch = useAppDispatch();

  const showProduct = type === "infinite-scroll" ? BlogData?.slice(0, cardToShow * currentPage) : BlogData?.slice(cardToShow * currentPage - cardToShow, cardToShow * currentPage);
  let ColBoxClass = "";
  switch (gridSize) {
    case 1:
      ColBoxClass = "col-12";
      break;
    case 2:
      ColBoxClass = "col-6";
      break;
    case 3:
      ColBoxClass = "col-6 col-xl-4";
      break;
    case 4:
      ColBoxClass = "col-6 col-xl-3";
      break;
    default:
      if (type === "title_box") {
        ColBoxClass = "col-md-6 col-12";
      }
      break;
  }  
  
  const BreakpointColumnsObj = { default: 3, 1199: 2, 470: 1 };

  const fetchMoreData = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };
  const infiniteScrollClass = { dataLength: showProduct.length, next: fetchMoreData, hasMore: currentPage < totalPages, className: "row g-sm-4 g-3", loader: <h4 className="spinner">Loading...</h4> };
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className={type !== "masonry" ? "g-sm-4 g-3 ratio3_2 row" : ""}>
        {type === "masonry" ? (
          <Gallery>
            <Masonry breakpointCols={BreakpointColumnsObj} className="row grid g-3 g-xl-4" columnClassName={`grid-item ${ColBoxClass} w-sm-100 masonry-grid`}>
              {showProduct.map((data, index) => (
                <BlogGridCard data={data} type={type} index={index} key={index} />
              ))}
            </Masonry>
          </Gallery>
        ) : type === "infinite-scroll" ? (
          <InfiniteScroll {...infiniteScrollClass}>
            {showProduct.map((data, index) => (
              <div className={`w-sm-100 ${ColBoxClass}`} key={index}>
                <BlogGridCard data={data} type={type} index={index} />
              </div>
            ))}
          </InfiniteScroll>
        ) : (
          <>
            {showProduct.map((item, i) => {
              return (
                <div key={i} className={`w-sm-100 ${ColBoxClass} ${type === "layout-1" ? (i === 0 ? "col-xxl-3 col-lg-4 col-6 order-lg-0 order-1 mt-lg-0" : i === 1 ? "col-xxl-9 col-lg-8 mt-0" : "col-xxl-3 col-lg-4 col-6") : ""} `}>
                  {type === "title_box" ? <BlogTitleBox data={item} /> : <BlogGridCard data={item} type={type} index={i} />}
                </div>
              );
            })}
          </>
        )}
      </div>

      {type === "load-more" ? (
        showProduct.length >= cardToShow ? (
          <Button className="btn-solid load-more" onClick={() => dispatch(setCardToShow(cardToShow + 3))}>
            LOAD MORE
          </Button>
        ) : (
          <p id="no-more-products" style={{ display: "block" }}>
            No more products available.
          </p>
        )
      ) : (
        type !== "infinite-scroll" && <Pagination type={type} currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </>
  );
};

export default BlogDetailBox;
