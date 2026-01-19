import { useAppDispatch } from "@/redux/hooks";
import { fetchCategoryApiData, fetchProductApiData } from "@/redux/reducers/ProductSlice";
import { useEffect } from "react";
import CompanyLogo from "./companyLogo";
import Job1HomeSection from "./job1HomeSection";
import JobHere from "./jobHere";
import JobSteps from "./jobSteps";
import Categories from "../common/category";
import JobHiring from "./jobHiring";
import JobAbout from "./jobAbout";
import JobReview from "./jobReview";
import NewsLetter from "./newsLetter";

const JobDemo1Container = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProductApiData());
    dispatch(fetchCategoryApiData());
  }, [dispatch]);
  
  return (
    <>
      <Job1HomeSection />
      <CompanyLogo />
      <JobHere />
      <JobSteps />
      <Categories type='job-1' />
      <JobHiring />
      <JobAbout />
      <JobReview />
      <NewsLetter/>
    </>
  );
};

export default JobDemo1Container;
