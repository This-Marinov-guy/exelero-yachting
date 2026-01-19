import { ImagePath, UserEmail, UserName, UserPhone } from "@/constants";
import { Edit2 } from "iconsax-react";
import Image from "next/image";
import React from "react";

const UserProfile = () => {
  return (
    <div className='main-sidebar-content'>
      <div className='profile-img'>
        <Image height={138} width={138} src={`${ImagePath}/car/person/2.jpg`} alt='p-2' className='img-fluid' unoptimized />
        <Edit2 className="iconsax" />
      </div>
      <div className='profile-content'>
        <h4>{UserName}</h4>
        <h6>{UserEmail}</h6>
        <h6>{UserPhone}</h6>
      </div>
    </div>
  );
};

export default UserProfile;
