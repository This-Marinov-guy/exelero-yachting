import CommonInput from "@/components/commonComponents/CommonInput";
import { Area } from "@/constants";
import { Row } from "reactstrap";

const AreaDetail = () => {
  return (
    <div className='user-form-box'>
      <h4 className='dashboard-title'>{Area}</h4>
      <Row className='gy-lg-4 g-3'>
        <CommonInput ColClass='col-sm-6' label='Covered Area' inputType='number' placeholder='Enter Covered Area' />
        <CommonInput ColClass='col-sm-6' label='Plot Area' inputType='number' placeholder='Enter Plot Area' />
        <CommonInput ColClass='col-sm-6' label='Plot Length' inputType='number' placeholder='Enter Plot Length' />
        <CommonInput ColClass='col-sm-6' label='Plot Breadth' inputType='number' placeholder='Enter Plot Breadth' />
      </Row>
    </div>
  );
};

export default AreaDetail;
