import { ImagePath, InterviewQuestionTitle, SVGPath } from "@/constants";
import { FAQImageData, InterviewQuestionContent, QuestionData } from "@/data/demo/jobDemo3";
import { RouteList } from "@/utils/RouteList";
import { ArrowUp } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";
import RatioImage from "@/utils/RatioImage";

const InterviewQuestion = () => {
  return (
    <section className='question-section position-relative'>
      <RatioImage src={`${SVGPath}/job/o-3.svg`} alt='o-3' className='img-fluid object-3 position-absolute' />
      <RatioImage src={`${SVGPath}/job/o-4.svg`} alt='o-4' className='img-fluid object-4 position-absolute' />        
      <Container>
        <CommonHeader title={InterviewQuestionTitle} content={InterviewQuestionContent} headClass='title-style-5' />
        <Row className='justify-content-lg-between justify-content-center align-items-center gy-5'>
          <Col xl={5} lg={6} xs={9}>
            <div className='main-img position-relative'>
              {FAQImageData.map((item, index) => (
                <Image key={index} src={`${ImagePath}${item.src}`} height={item.height} width={item.width} alt={item.alt} className={item.className} unoptimized />
              ))}
            </div>
          </Col>
          <Col xl={6} lg={6}>
            <ul className='question-list'>
              {QuestionData.map((item, index) => (
                <li key={index}>
                  <div className='question-list-flex'>
                    <h3>{item.title}</h3>
                    <h4>{item.questions}</h4>
                  </div>
                  <Link href={RouteList.Pages.Other.Faq} className='arrow-circle'>
                    <ArrowUp className='iconsax' />
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default InterviewQuestion;
