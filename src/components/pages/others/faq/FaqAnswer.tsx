import { FaqFormContent, FaqFormTitle, Send } from "@/constants";
import React from "react";
import { Button, Input } from "reactstrap";

const FaqAnswer = () => {
  return (
    <div className='faq-section section-b-space'>
      <div className="container">
        <div className='text-center content-title faq-bottom-title'>
          <h2>{FaqFormTitle}</h2>
          <p>{FaqFormContent}</p>
        </div>
        <div className='question-box'>
          <form className='login-form'>
            <div className='form-input'>
              <Input type='email' placeholder='Enter Your Email' />
            </div>
            <div className='form-input'>
              <textarea className='form-control' placeholder='Type Your Question here...' defaultValue={""} />
            </div>
            <div className='form-input text-end'>
              <Button className='btn-solid' color=''>
                {Send}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FaqAnswer;
