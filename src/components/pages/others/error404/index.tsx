import { content404, GoBack, NotFoundTitle } from "@/constants";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import { Container } from "reactstrap";

const Error404Container = () => {
  return (
    <>
      <section className='section-b-space error-section'>
        <Container>
          <div className='error-box'>
            <div className='error-content'>
              <Image src={`/assets/images/logo/1.png`} width={200} height={200} alt={"404"} style={{ width: "200px", height: "200px" }} />
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
