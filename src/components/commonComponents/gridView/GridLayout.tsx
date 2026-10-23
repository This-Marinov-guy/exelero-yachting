import CarProductBox1 from "@/components/commonComponents/productBox/CarProductBox1";
import Boat1DetailBox from "@/components/commonComponents/productBox/Boat1DetailBox";
import Boat2DetailBox from "@/components/commonComponents/productBox/Boat2DetailBox";
import Job4DetailBox from "@/components/commonComponents/productBox/Job4DetailBox";
import NotFound from "@/components/commonComponents/productBox/NotFound";
import Property1DetailBox from "@/components/commonComponents/productBox/Property1DetailBox";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCardToShow, setTotalProduct } from "@/redux/reducers/LayoutSlice";
import { FC, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Row } from "reactstrap";
import { Swiper as SwiperType } from "swiper";
import { GridLayoutType, ProductType } from "@/types/Product";
import Pagination from "./filter/Pagination";
import UseFilterCar from "./UseFilterCar";
import UseFilterBoats from "./UseFilterBoats";
import UseFilterJob from "./UseFilterJob";
import UseFilterProperty from "./UseFilterProperty";
import Job5DetailBox from "@/components/commonComponents/productBox/Job5DetailBox";
import Job1DetailBox from "@/components/commonComponents/productBox/Job1DetailBox";
import Job6DetailBox from "@/components/commonComponents/productBox/Job6DetailBox";
import Job7DetailBox from "@/components/commonComponents/productBox/Job7DetailBox";
import JobAdsBox from "./JobAdsBox";
import Job8DetailBox from "@/components/commonComponents/productBox/Job8DetailBox";
import { usePublicText } from "@/lib/usePublicText";
import { useBoatFilters } from "@/components/pages/boats/BoatFiltersContext";

const GridLayout: FC<GridLayoutType> = ({ value, type, gridType, gridSize, view, scrollType, map, detailBoxStyle }) => {
  const tr = usePublicText();
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const boatQuery = useBoatFilters();
  const { cardToShow } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();

  let filteredProducts: ProductType[] = [];
  switch (type) {
    case "property":
      filteredProducts = UseFilterProperty({ value });
      break;
    case "car":
      filteredProducts = UseFilterCar({ value });
      break;
    case "boat":
      filteredProducts = UseFilterBoats({ value });
      break;
    case "job":
      filteredProducts = UseFilterJob({ value });
      break;
    default:
      filteredProducts = [];
  }

  const totalPages = Math.ceil(filteredProducts.length / cardToShow);
  const activePage = type === "boat" && boatQuery ? boatQuery.filters.page : currentPage;
  const visiblePage = activePage <= totalPages ? activePage : 1;
  const showProduct = scrollType === "infinite"
      ? filteredProducts.slice(0, cardToShow * visiblePage)
      : filteredProducts.slice(cardToShow * (visiblePage - 1), cardToShow * visiblePage);

  const fetchMoreData = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const infiniteScrollProps = {
    dataLength: showProduct.length,
    next: fetchMoreData,
    hasMore: currentPage < totalPages,
    className: "row gy-4",
    loader: <h4 className="spinner">{tr("Loading...")}</h4>,
  };

  useEffect(() => {
    if (swiperRef.current) swiperRef.current.init();
  }, []);

  const handlePageChange = (page: number) => {
    if (type === "boat" && boatQuery) boatQuery.setPage(page);
    else setCurrentPage(page);
  };

  useEffect(() => {
    dispatch(setTotalProduct(filteredProducts.length || 0));
    if (type === "boat" && boatQuery && activePage > totalPages && activePage !== 1) {
      boatQuery.setPage(1, true);
    }
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredProducts.length, dispatch, totalPages, currentPage, type, boatQuery?.setPage, activePage]);

  const getColData = () => {
    switch (gridSize) {
      case 1: return "col-xl-12";
      case 2: return "col-lg-6";
      case 3: return "col-lg-4 col-sm-6";
      case 4: return "col-xxl-3 col-lg-4 col-sm-6";
      default: return "col-sm-6";
    }
  };

  const getRowData = () => {
    const base = "gy-4";
    const ratio =
      gridType === "list-view"
        ? type === "car" ? "car-list-section ratio_65" : "ratio3_2"
        : view === "multiple"
          ? "ratio_65"
          : "ratio_landscape";
    const scrollClass = scrollType === "load-more" ? "load-more-list" : "";
    return `${base} ${ratio} ${scrollClass}`;
  };

  const renderJobBox = (data: ProductType, index: number) => {
    if (detailBoxStyle === "style-progress") return <Job4DetailBox data={data} />;
    if (detailBoxStyle === "style-2") return <Job5DetailBox data={data} />;
    if (detailBoxStyle === "style-3") return <Job6DetailBox data={data} />;
    if (detailBoxStyle === "style-4" || detailBoxStyle === "job-ads") return <Job7DetailBox data={data} index={index} jobAds />;
    if (detailBoxStyle === "both") return <Job8DetailBox data={data} />;
    return <Job1DetailBox data={data} />;
  };

  const renderProductBox = (data: ProductType, index: number) => {
    switch (type) {
      case "property":
        return <Property1DetailBox data={data} view={view} />;
      case "car":
        return <CarProductBox1 data={data} view={view} gridType={gridType} />;
      case "boat":
        return <Boat2DetailBox data={data} label={tr("For Sale")} index={index} />;
      case "job":
        return (
          <>
            {renderJobBox(data, index)}
            {detailBoxStyle === "job-ads" && index % 2 === 1 && <JobAdsBox id={index} />}
          </>
        );
      default:
        return null;
    }
  };

  const ColData = getColData();
  const RowData = getRowData();

  const renderContent = () => {
    if (scrollType === "infinite") {
      return (
        <InfiniteScroll {...infiniteScrollProps}>
          {showProduct.map((data, index) => (
            <div className={ColData} key={data.id || index}>
              {renderProductBox(data, index)}
            </div>
          ))}
        </InfiniteScroll>
      );
    }

    return showProduct.map((data, index) => (
      <div className={ColData} key={data.id || index}>
        {renderProductBox(data, index)}
      </div>
    ));
  };

  return (
    <div className={`${map ? "col-xl-6" : ""} ${scrollType === "load-more" ? "featured-wrapper" : ""}`}>
      <Row className={RowData}>
        {renderContent()}
        {showProduct.length === 0 && <NotFound word={tr("No Boats found")} />}
      </Row>

      {scrollType === "load-more" ? (
        showProduct.length >= cardToShow ? (
          <Button className="btn-solid load-more" onClick={() => dispatch(setCardToShow(cardToShow + 3))}>
            {tr("LOAD MORE")}
          </Button>
        ) : (
          <p id="no-more-products" style={{ display: "block" }}>
            {tr("No more products available.")}
          </p>
        )
      ) : (scrollType !== "infinite" && showProduct.length > 0) ? (
        <div className={`${type === "job" ? "text-center" : ""}`}>
          <Pagination type={type} currentPage={visiblePage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      ) : null}
    </div>
  );
};

export default GridLayout;
