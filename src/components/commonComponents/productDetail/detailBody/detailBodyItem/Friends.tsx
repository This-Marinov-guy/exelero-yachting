import { ShareFriends } from "@/constants";
import Link from "next/link";

const Friends = () => {
  return (
    <div className='share-friends'>
      <h6>Have a friend who’ll be good for this job?</h6>
      <Link href='https://web.whatsapp.com/' target='_blank' className='btn-solid'>
        <i className='ri-whatsapp-line' />
        {ShareFriends}
      </Link>
    </div>
  );
};

export default Friends;
