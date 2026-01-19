import React, { useState } from "react";
import { Button, Col, Input, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import CloseBtn from "../CloseBtn";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setTestDriverModal } from "@/redux/reducers/LayoutSlice";
import { Schedule, SendRequest } from "@/constants";
import DatePicker from "react-datepicker";

const TestDriverModal = () => {
  const dispatch = useAppDispatch();
  const { testDriverModal } = useAppSelector((state) => state.layout);
  const toggle = () => dispatch(setTestDriverModal());
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(new Date());

  return (
    <Modal centered fade modalClassName='theme-modal' isOpen={testDriverModal} toggle={toggle}>
      <div className='modal-content'>
        <ModalHeader toggle={toggle} close={<CloseBtn toggle={toggle} />} />
        <ModalBody>
          <h3 className="car-title">{Schedule}</h3>
          <Row className='gy-3'>
            <Col xs={12}>
              <div className='review-input'>
                <Input type='text' placeholder='Enter Your Name' />
              </div>
            </Col>
            <Col xs={12}>
              <div className='review-input'>
                <Input type='text' placeholder='Your Phone' />
              </div>
            </Col>
            <Col xs={12}>
              <div className='review-input'>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select Date"
                  className="form-control"
                  customInput={<Input />}
                />
              </div>
            </Col>
            <Col xs={12}>
              <div className='review-input'>
                <DatePicker
                  selected={startTime}
                  onChange={(date: Date | null) => setStartTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeFormat="HH:mm"
                  dateFormat="HH:mm"
                  placeholderText="Select Time"
                  className="form-control"
                  customInput={<Input />}
                />
              </div>
            </Col>
            <Col xs={12}>
              <div className='review-input'>
                <Button className='btn-solid'>
                  {SendRequest}
                </Button>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </div>
    </Modal>
  );
};

export default TestDriverModal;
