import React, { FC } from "react";
import { Button, Container, Input, InputGroup } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";
import { NewsletterTitle, Subscribe } from "@/constants";
import { NewsletterContentData } from "@/data/demo/jobDemo1";

const NewsLetter: FC<{ mainClass?: string }> = ({ mainClass }) => {
  return (
    <section className={` ${mainClass ? mainClass : ""} job-newsletter-section section-b-space`}>
      <Container>
        <div className='job-newsletter-box'>
          <div className='newsletter-content'>
            <CommonHeader title={NewsletterTitle} content={NewsletterContentData} headClass='title-style-3 dark-title' />
            <InputGroup>
              <Input type='email' placeholder='Your mail address' />
              <Button className='btn-solid'>{Subscribe}</Button>
            </InputGroup>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default NewsLetter;
