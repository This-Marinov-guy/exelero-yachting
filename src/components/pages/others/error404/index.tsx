'use client';
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { content404, GoBack, ImagePath, NotFoundTitle } from "@/constants";
import RatioImage from "@/utils/RatioImage";
import { RouteList } from "@/utils/RouteList";
import Link from "next/link";
import { Container } from "reactstrap";

const Error404Container = () => {
  return (
    <>
      <Breadcrumbs title='404' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image />
      <section className='section-b-space error-section'>
        <Container>
          <div className='error-box'>
            <div className='error-content'>
              <RatioImage src={`${ImagePath}/other/404.svg`} alt={"404"} className='img-fluid' />
              <h2>{NotFoundTitle}</h2>
              <p>{content404}</p>
              <Link href={RouteList.Home.CarDemo1} className='btn-solid'>
                {GoBack}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Error404Container;
