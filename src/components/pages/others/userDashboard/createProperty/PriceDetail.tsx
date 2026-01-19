import CommonInput from "@/components/commonComponents/CommonInput";
import { PriceDetailsTitle, PriceInclude } from "@/constants";
import { PriceListData } from "@/data/pages/Others";
import { Input, Row } from "reactstrap";

const PriceDetail = () => {
  return (
    <div className='user-form-box'>
    <h4 className='dashboard-title'>{PriceDetailsTitle}</h4>
    <Row className='g-4'>
      <CommonInput ColClass='col-sm-6' label='Price' inputType='number' placeholder='Enter Your Price' />
      <CommonInput ColClass='col-sm-6' label='Show Price As' inputType='number' placeholder='Enter price As' />
      <div className='include-price-list'>
        <span>{PriceInclude}</span>
        <ul className='user-choose-list'>
          {PriceListData.map((item, i) => {
            return (
              <li key={i} className='main-choose-item'>
                <div className='choose-item'>
                  <Input type='checkbox' id={`plc-${i + 1}`} />
                  <label className='label-flex' htmlFor={`Furnishing-${i + 1}`}>
                    <span>{item}</span>
                  </label>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className='text-checkbox'>
        <Input type='checkbox' id='stamp' />
        <label htmlFor='stamp'>Stamp Duty &amp; Registration charges excluded.</label>
      </div>
      <CommonInput ColClass='col-sm-6' label='Booking / Token' inputType='number' placeholder='Enter Booking Amount' />
      <CommonInput ColClass='col-sm-6' label='Maintenance Charge' inputType='number' placeholder='Enter Maintenance Charge' />
    </Row>
  </div>
  )
}

export default PriceDetail
