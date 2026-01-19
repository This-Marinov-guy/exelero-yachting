import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setReviewModal } from "@/redux/reducers/LayoutSlice";
import { DetailBodyItemType, ReviewFormInputs } from "@/types/Product";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Col, Modal, ModalBody, ModalHeader } from "reactstrap";
import CloseBtn from "../CloseBtn";
import { FC } from "react";
import { InitialModalRatings } from "@/data/car";
import { Rating } from "react-simple-star-rating";

const ReviewModal: FC<DetailBodyItemType> = ({ type, label }) => {
  const dispatch = useAppDispatch();
  const { reviewModal } = useAppSelector((state) => state.layout);
  const toggle = () => dispatch(setReviewModal());
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFormInputs>();
  const onSubmit: SubmitHandler<ReviewFormInputs> = (data) => {
    console.log("Review Submitted:", data);
    reset();
    toggle();
  };

  return (
    <Modal size='lg' centered fade modalClassName='theme-modal review-modal' isOpen={reviewModal} toggle={toggle}>
      <div className='modal-content'>
        <ModalHeader toggle={toggle} close={<CloseBtn toggle={toggle} />} />
        <ModalBody>
          <div>
            <h4 className='detail-page-title'>{type === 'car' ?`Add a Review`:type === 'blog' ?`Leave a Comment`:'Write a Review'}</h4>
            <form onSubmit={handleSubmit(onSubmit)} className='row gy-lg-4 gy-2'>
            <Col lg={6}>
                <ul className='add-review-list'>
                  {InitialModalRatings.slice(0, 3).map((item, i) => {
                    return (
                        <li className='add-review-item' key={i}>
                          <span>{item.criteria}</span>
                          <ul className='rating'>
                            <Rating initialValue={item.rating} size={20}/>                             
                          </ul>
                        </li>
                    );
                  })}
                  </ul>
                </Col>
                <Col lg={6}>
                <ul className='add-review-list'>
                  {InitialModalRatings.slice(3).map((item, i) => {
                    return (
                        <li className='add-review-item'  key={i}>
                          <span>{item.criteria}</span>
                          <ul className='rating'>
                            <Rating initialValue={item.rating} size={20}/>                             
                          </ul>
                        </li>
                    );
                  })}
                  </ul>
                </Col>
              <Col sm={6}>
                <div className='review-input'>
                  <input type='text' className={`form-control ${errors.name ? "is-invalid" : ""}`} placeholder='Enter Your Name' {...register("name", { required: "Name is required" })} />
                  {errors.name && <div className='invalid-feedback'>{errors.name.message}</div>}
                </div>
              </Col>
              <Col sm={6}>
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
              <Col xs={12}>
                <div className='review-input'>
                  <textarea className={`form-control ${errors.message ? "is-invalid" : ""}`} placeholder='Message' {...register("message", { required: "Message is required" })} />
                  {errors.message && <div className='invalid-feedback'>{errors.message.message}</div>}
                </div>
              </Col>
              <Col xs={12}>
                <div className='review-input'>
                  <Button className='btn-solid'>Submit Review</Button>
                </div>
              </Col>
            </form>
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
};

export default ReviewModal;
