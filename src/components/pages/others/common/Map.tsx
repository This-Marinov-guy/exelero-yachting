import React, { FC } from "react";

const Map: FC<{ subclass?: string }> = ({ subclass }) => {
  return (
    <div className={`${subclass ? subclass : ""} contact-map`}>
      <iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27404.108970975958!2d-74.15219533827555!3d40.573765671825385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1712811360770!5m2!1sen!2sin' style={{ border: 0 }} allowFullScreen loading='lazy' referrerPolicy='no-referrer-when-downgrade' />
    </div>
  );
};

export default Map;
