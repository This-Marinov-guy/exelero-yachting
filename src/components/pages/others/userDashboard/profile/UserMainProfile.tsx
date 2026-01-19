import { ImagePath, Lead, MyProfile, RealEstateAgent, UserName } from "@/constants";
import Image from "next/image";

const UserMainProfile = () => {
  return (
    <div className='white-card'>
      <div className='edit-flex'>
        <h4 className='dashboard-title mb-0'>{MyProfile}</h4>
      </div>
      <div className='profile-img'>
        <Image height={90} width={90} src={`${ImagePath}/car/person/2.jpg`} alt='p-1' className='img-fluid' />
        <div className='profile-content'>
          <h4>{UserName}</h4>
          <h6>{RealEstateAgent}</h6>
          <span>{Lead}</span>
        </div>
      </div>
    </div>
  );
};

export default UserMainProfile;
