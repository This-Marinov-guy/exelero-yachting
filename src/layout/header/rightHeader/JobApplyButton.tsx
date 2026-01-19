import { ApplyNow, Login, Signin, UploadResume } from "@/constants";
import { RouteList } from "@/utils/RouteList";
import { ExportCurve } from "iconsax-react";
import Link from "next/link";
import React, { Fragment } from "react";

const JobApplyButton: React.FC<{ part?: string }> = ({ part }) => {
  return (
    <Fragment>
      <Link href={RouteList.Pages.Other.Login1} className='white-text-btn'>
        {part?.includes("job-2") ? Login : Signin}
      </Link>
      <Link href={RouteList.Pages.Other.ContactUs1} className={part?.includes("job-2") ? "btn-pills pills-sm" : "btn-solid"}>
        {part?.includes("job-2") ? (
          ApplyNow
        ) : (
          <Fragment>
            {UploadResume}
            <ExportCurve size={24} color="white"/>
          </Fragment>
        )}
      </Link>
    </Fragment>
  );
};

export default JobApplyButton;
