import ReviewModal from "@/components/commonComponents/modal/ReviewModal";
import { Href, ImagePath, ReviewsTitle, ReviewTitle } from "@/constants";
import { CarReviews, CarReviewType } from "@/data/car";
import { Reviews } from "@/data/property";
import { useAppDispatch } from "@/redux/hooks";
import { setReviewModal } from "@/redux/reducers/LayoutSlice";
import { DetailBodyItemType } from "@/types/Product";
import { MessageEdit, Clock } from "iconsax-react";
import Link from "next/link";
import React, { FC, Fragment } from "react";
import { Rating } from "react-simple-star-rating";
import { Button, Col, Progress, Row } from "reactstrap";

const ReviewProperty: FC<DetailBodyItemType> = ({ label, type }) => {
  const dispatch = useAppDispatch();
  return (
    <Fragment>
      {type == "car" ? (
        <div className='detail-box' id='review'>
          <div>
            <div className='modal-btn-flex'>
              <h3 className='car-title'>{ReviewTitle}</h3>
              <Button color='' className='text-btn' onClick={() => dispatch(setReviewModal())}>
                <MessageEdit size={18} className='iconsax' color='#188AEC' /> Add a Review
              </Button>
            </div>
            <div className='overall-review-box'>
              <Row className='g-xxl-5 gy-3'>
                <Col xxl={3}>
                  <div className='progress-circle' data-percentage={90}>
                    <span className='progress-left'>
                      <span className='progress-bar-line' />
                    </span>
                    <span className='progress-right'>
                      <span className='progress-bar-line' />
                    </span>
                    <div className='progress-value'>
                      <div>
                        <h6>
                          Overall Ratings<span>4.6</span>out of 5
                        </h6>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xxl={9}>
                  <ul className='review-list'>
                    {CarReviewType.map((item, i) => {
                      return (
                        <li className='review-item' key={i}>
                          <div className='rating-flex'>
                            <h6>{item.label}</h6>
                            <span>{item.status}</span>
                          </div>
                          <div className='progress'>
                            <Progress className={`progress-bar`} style={{ width: `${item.width}%` }} />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Col>
              </Row>
            </div>
            <ul className='review-main-list'>
              {CarReviews.map((item, index) => {
                return (
                  <li className='review-box' key={index}>
                    <div className='review-profile'>
                      <img src={`${ImagePath}/car/person/${index + 1}.jpg`} alt='p-1' className='img-fluid' />
                      <div className='profile-flex'>
                        <div>
                          <h6>{item.name}</h6>
                          <ul className='rating'>
                            <Rating size={20} initialValue={item.rating} disableFillHover />
                          </ul>
                        </div>
                        <span>
                          <Clock className='iconsax'/>
                          {item.reviewDate}
                        </span>
                      </div>
                    </div>
                    <p>{item.reviewText}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        <div className='detail-body' id='review'>
          <div className='modal-btn-flex'>
            {label && <h4 className='detail-page-title'>{ReviewsTitle}</h4>}
            <Button className='text-btn' color='transperant' onClick={() => dispatch(setReviewModal())}>
              <MessageEdit size={18} className='iconsax' color='#04AEB4' /> Write a Review
            </Button>
          </div>
          <ul className='review-list'>
            {Reviews.map((review, index) => (
              <li className='review-box' key={index}>
                <div className='review-item'>
                  <div className='review-img-info'>
                    <img src={`${ImagePath}/property/detail/${review.img}`} alt={`review-${index + 1}`} className='img-fluid' />
                    <div className='review-info'>
                      <h5>{review.name}</h5>
                      <span>{review.date}</span>
                    </div>
                  </div>
                  <div className='rating-flex'>
                    <div className='like-section'>
                      <span>Was this helpful?</span>
                      <Link scroll={false} href={Href}>
                        <i className='ri-thumb-up-line' />
                        {review.helpful.likes}
                      </Link>
                      <Link scroll={false} href={Href}>
                        <i className='ri-thumb-down-line' />
                        {review.helpful.dislikes}
                      </Link>
                    </div>
                    <ul className='rating'>
                      <Rating size={20} initialValue={4} disableFillHover />
                    </ul>
                  </div>
                </div>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ReviewModal type={type} />
    </Fragment>
  );
};

export default ReviewProperty;
