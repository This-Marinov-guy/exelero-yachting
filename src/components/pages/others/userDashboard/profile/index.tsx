import AddressModal from "@/components/commonComponents/modal/AddressModal";
import PersonalModal from "@/components/commonComponents/modal/PersonalModal";
import { AddressInfo, PersonalInfo } from "@/data/pages/Others";
import CommonProfileDetail from "../common/CommonProfileDetail";
import UserMainProfile from "./UserMainProfile";

const Profile = () => {
  return (
    <div className='profile-main'>
      <div className="common-card">
        <UserMainProfile />
        <CommonProfileDetail title='Personal Information' data={PersonalInfo} modalId={1} />
        <CommonProfileDetail title='Address' data={AddressInfo} modalId={2} />
        <PersonalModal />
        <AddressModal />
      </div>
    </div>
  );
};

export default Profile;
