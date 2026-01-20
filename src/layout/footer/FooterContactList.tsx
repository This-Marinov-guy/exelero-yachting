import { ContactListData } from "@/data/layout/Footer";
import React from "react";

const FooterContactList = () => {
  const getHref = (title: string, value: string) => {
    const t = title.toLowerCase();

    if (t.includes("call") || t.includes("phone")) {
      // keep digits/+ only for tel:
      const tel = value.replace(/[^\d+]/g, "");
      return `tel:${tel}`;
    }

    if (t.includes("email") || t.includes("mail")) {
      return `mailto:${value.trim()}`;
    }

    // Location / address
    const q = encodeURIComponent(value.trim());
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  };

  return (
    <ul className='footer-contact-list'>
      {ContactListData.map((item, index) => (
        <li key={index}>
          <div className='footer-icon'>{item.icon}</div>
          <div className='footer-contact'>
            <h4>{item.title}</h4>
            <h6>
              <a href={getHref(item.title, item.text)} target={item.title.toLowerCase().includes("location") ? "_blank" : undefined} rel={item.title.toLowerCase().includes("location") ? "noreferrer" : undefined}>
                {item.text}
              </a>
            </h6>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FooterContactList;
