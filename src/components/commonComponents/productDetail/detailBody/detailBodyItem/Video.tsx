import VideoModal from "@/components/commonComponents/modal/VideoModal";
import { ImagePath } from "@/constants";
import { useAppDispatch } from "@/redux/hooks";
import { setVideoModal } from "@/redux/reducers/LayoutSlice";
import { DetailBodyItemType } from "@/types/Product";
import { Play } from "iconsax-react";
import { FC, Fragment } from "react";
import { Button } from "reactstrap";

const Video: FC<DetailBodyItemType> = () => {
  const dispatch = useAppDispatch();
  return (
    <Fragment>
      <div className='detail-body ratio_60' id="video">
        <div className='video-img'>
          <img src={`${ImagePath}/property/detail/4.jpg`} alt='v-1' className='img-fluid bg-img' />
          <Button className='play-btn' onClick={() => dispatch(setVideoModal())}>
            <Play className='iconsax' color='white' size={24} />
          </Button>
        </div>
      </div>
      <VideoModal />
    </Fragment>
  );
};

export default Video;
