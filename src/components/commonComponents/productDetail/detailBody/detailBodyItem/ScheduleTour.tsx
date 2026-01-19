import { DaysInMarch, ScheduleSlider, Time } from "@/data/property";
import { DetailBodyItemType, ScheduleFormInputs } from "@/types/Product";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Col, Input, Row } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";

const ScheduleTour: FC<DetailBodyItemType> = ({ label }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ScheduleFormInputs>();
  const onSubmit: SubmitHandler<ScheduleFormInputs> = (data) => {
    console.log("Review Submitted:", data);
    reset();
  };
  return (
    <div className='detail-body' id='schedule'>
      {label && <h4 className='detail-page-title'>Schedule a Tour</h4>}
      <Swiper {...ScheduleSlider} className='schedule-slider'>
        {DaysInMarch.map((schedule, index) => (
          <SwiperSlide key={index}>
            <div className='schedule-box'>
              <span>{schedule.day}</span>
              <span>{String(schedule.date).padStart(2, "0")}</span>
              <span>mar</span>
            </div>
          </SwiperSlide>
        ))}
        <div className='swiper-button-next' />
        <div className='swiper-button-prev' />
      </Swiper>
      <form className='schedule-form' onSubmit={handleSubmit(onSubmit)}>
        <Row className='gy-sm-4 gy-3'>
          <Col lg={6}>
            <div className='review-input'>
              <input type='text' className={`form-control ${errors.name ? "is-invalid" : ""}`} {...register("name", { required: "Name is required" })} placeholder='Enter Your Name' />
              {errors.name && <div className='invalid-feedback'>{errors.name.message}</div>}
            </div>
          </Col>
          <Col lg={6}>
            <div className='review-input'>
              <input
                type='email'
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder='Enter Your E-mail'
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <div className='invalid-feedback'>{errors.email.message}</div>}
            </div>
          </Col>
          <Col lg={6}>
            <div className='review-input'>
              <Input type='select' className='form-control' required>
                <option defaultValue='--Select Your Time--'>--Select Your Time--</option>
                {Time.map(({ hour, minute }, index) => (
                  <option key={index} defaultValue={index}>
                    {hour}:{minute}
                  </option>
                ))}
              </Input>
              {errors.time && <div className='invalid-feedback'>{errors.time.message}</div>}
            </div>
          </Col>
          <Col lg={6}>
            <div className='review-input'>
              <input type='text' className={`form-control ${errors.number ? "is-invalid" : ""}`} {...register("number", { required: "Number is required", max: 10 })} placeholder='Enter Your Number' />
              {errors.number && <div className='invalid-feedback'>{errors.number.message}</div>}
            </div>
          </Col>
          <Col lg={12}>
            <div className='review-input'>
              <textarea className={`form-control ${errors.message ? "is-invalid" : ""}`} placeholder='Message' {...register("message", { required: "Message is required" })} />
              {errors.message && <div className='invalid-feedback'>{errors.message.message}</div>}
            </div>
          </Col>
          <Col lg={12}>
            <div className='review-input'>
              <Button className='btn-solid'>Submit Review</Button>
            </div>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default ScheduleTour;
