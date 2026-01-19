import Property1DetailBox from "@/components/commonComponents/productBox/Property1DetailBox";
import Pagination from "@/components/commonComponents/gridView/filter/Pagination";
import { MyFavoritesTitle } from "@/constants";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import { Col, Row } from "reactstrap";

const MyFavorites = () => {
  const { productItem } = useAppSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const { cardToShow } = useAppSelector((state) => state.layout);

  const Product = productItem.filter((item) => item.type === "property");
  const totalPages = Math.ceil(Product?.length / cardToShow);
  const showProduct = Product?.slice(cardToShow * currentPage - cardToShow, cardToShow * currentPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <h4 className='dashboard-title'>{MyFavoritesTitle}</h4>
      <Row className='gy-4 ratio_landscape'>
        {showProduct.map((data, index) => (
          <Col xl='4' sm='6' key={data.id || index}>
            <Property1DetailBox data={data} />
          </Col>
        ))}
      </Row>
      <Pagination type={"property"} currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </>
  );
};

export default MyFavorites;
