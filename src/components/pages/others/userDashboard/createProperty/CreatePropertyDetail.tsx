import CommonInput from "@/components/commonComponents/CommonInput";
import { PropertyFeatures } from "@/constants";
import { Col, Row } from "reactstrap";
import FeatureItem from "../common/FeatureItem";
import RadioGroup from "../common/RadioGroup";

const CreatePropertyDetail = () => {
  return (
    <div className='user-form-box'>
      <h4 className='dashboard-title'>{PropertyFeatures}</h4>
      <Row className='g-4'>
        <Col md={4} sm={6}>
          <RadioGroup name='bed' label='Bedroom' labels={["1", "2", "3", "4", "5"]} ids={["b1", "b2", "b3", "b4", "b5"]} />
        </Col>
        <Col md={4} sm={6}>
          <RadioGroup name='bathroom' label='Bathroom' labels={["1", "2", "3", "4", "5"]} ids={["ba1", "ba2", "ba3", "ba4", "ba5"]} />
        </Col>
        <Col md={4} sm={6}>
          <RadioGroup name='floorNo' label='Floor No.' labels={["1", "2", "3", "4", "5"]} ids={["fn", "fn2", "fn3", "fn4", "fn5"]} />
        </Col>
        <CommonInput ColClass='col-sm-6' label='Cabin Meeting Room' inputType='number' placeholder='Enter Room' />
        <CommonInput ColClass='col-sm-6' label='Meeting Time' inputType='number' placeholder='Enter Meeting Time' />
        <ul className='feature-list'>
          <FeatureItem label='Attached Bathroom' name='attachedBathroom' />
          <FeatureItem label='Attached Balconies' name='attachedBalconies' />
          <FeatureItem label='Common Area' name='commonArea' />
          <FeatureItem label='Personal Washroom' name='personalWashroom' />
        </ul>
      </Row>
    </div>
  );
};

export default CreatePropertyDetail;
