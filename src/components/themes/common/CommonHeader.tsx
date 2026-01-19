import Link from "next/link";
import { ViewAll } from "@/constants";
import { CommonHeaderType } from "@/types/CommonComponents";
import { RouteList } from "@/utils/RouteList";

const CommonHeader: React.FC<CommonHeaderType> = ({ title, content, animation, headClass, titleClass, view, subClass, url, contentClass }) => {
  return (
    <div className={headClass}>
      <div className={subClass ? subClass : "title-flex"}>
        {animation && (
          <div className="title-animation-left">
            <span />
            <span />
          </div>
        )}
        <h2 className={titleClass}>{title}</h2>
        {animation && (
          <div className="title-animation-right">
            <span />
            <span />
          </div>
        )}
        {view && <Link href={url || RouteList.Home.CarDemo1}>{ViewAll}</Link>}
      </div>
      <p className={contentClass ? contentClass : ""}>{content}</p>
    </div>
  );
};

export default CommonHeader;
