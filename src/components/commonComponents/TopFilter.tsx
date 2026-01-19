import SearchTabList from "@/components/themes/common/SearchTabList";
import { Container } from "reactstrap";
import ParticleComponent from "./ParticleComponent";

const TopFilter = () => {
  return (
    <div className='breadcrumbs-section'>
      <Container>
        <div className='breadcrumbs-main'>
          <div className='property-home-tab'>
            <SearchTabList endPoint={2} showTab={[1, 2, 10, 11]} showNav />
          </div>
        </div>
      </Container>
      <ParticleComponent />
    </div>
  );
};

export default TopFilter;
