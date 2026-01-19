import { ContactListData } from "@/data/layout/Footer";
import React from "react";

const FooterContactList = () => {
  return (
    <ul className='footer-contact-list'>
      {ContactListData.map((item, index) => (
        <li key={index}>
          <div className='footer-icon'>{item.icon}</div>
          <div className='footer-contact'>
            <h4>{item.title}</h4>
            <h6>{item.text}</h6>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FooterContactList;
