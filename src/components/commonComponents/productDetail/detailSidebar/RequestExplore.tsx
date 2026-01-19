import { Href, RequestTitle } from "@/constants";
import { DetailBodyItemType } from "@/types/Product";
import Link from "next/link";
import React, { FC } from "react";
import { Input } from "reactstrap";

const RequestExplore:FC<DetailBodyItemType>  = ({type}) => {
  return (
    <div className='detail-sidebar-box'>
      <h4 className={`${type === 'car' ? 'car-title':'detail-page-title'}`}>{RequestTitle}</h4>
      <div className='detail-input'>
        <Input type='text' placeholder='Your Name' />
      </div>
      <div className='detail-input'>
        <Input type='email' placeholder='Email Address' />
      </div>
      <div className='detail-input'>
        <Input type='text' placeholder='Phone Number' />
      </div>
      <div className='detail-input'>
        <textarea className="form-control" placeholder='Message' defaultValue={""} />
      </div>
      <div className='detail-input'>
        <Link scroll={false} href={Href} className='btn-solid'>
          Submit Request
        </Link>
      </div>
    </div>
  );
};

export default RequestExplore;
