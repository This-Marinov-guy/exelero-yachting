import CommonInput from "@/components/commonComponents/CommonInput";
import { PropertyDetailsTitle } from "@/constants";
import { Col, Row } from "reactstrap";
import DashboardDropDown from "../common/DashboardDropdown";

const PropertyAllDetails = () => {
  return (
    <div className='user-form-box'>
      <h4 className='dashboard-title'>{PropertyDetailsTitle}</h4>
      <Row className='gy-lg-4 g-3'>
        <Col md={4} sm={6}>
          <DashboardDropDown label='Property Type' options={["Apartment", "House", "Villa", "Office", "Farmhouse"]} placeholder='Enter Property Type' />
        </Col>
        <Col md={4} sm={6}>
          <DashboardDropDown label='Property Status' options={["Sale", "Rent", "PG"]} placeholder='Enter Property Status' />
        </Col>
        <CommonInput ColClass='col-md-4 col-sm-6' label='Any City' inputType='text' placeholder='Enter Your City' />
        <CommonInput ColClass='col-md-8 col-sm-6' label='Address' inputType='text' placeholder='Enter Your Address' />
        <CommonInput ColClass='col-md-4 col-sm-6' label='Any Country' inputType='text' placeholder='Enter Your Country' />
      </Row>
    </div>
  );
};

export default PropertyAllDetails;
