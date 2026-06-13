
import { FC } from "react";
import { ProductType } from "@/types/Product";

interface BoatDetailImagesProps {
  boat: ProductType;
}

const BoatDetailImages: FC<BoatDetailImagesProps> = ({ boat }) => {
  if (!boat.image || boat.image.length === 0) {
    return null;
  }

  return (
    <div className="detail-images boat-detail-preview">
      <img
        src={boat.image[0]}
        alt={boat.title}
        className="boat-detail-preview-image"
      />
    </div>
  );
};

export default BoatDetailImages;
