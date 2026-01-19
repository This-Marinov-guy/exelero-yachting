import { useAppDispatch } from "@/redux/hooks";
import { fetchCategoryApiData, fetchProductApiData } from "@/redux/reducers/ProductSlice";
import { useEffect } from "react";
import LogoSection from "../common/LogoSection";
import ExploreByCity from "./exploreByCity";
import InterViewQuestion from "./interviewQuestion";
import Job3HomeSection from "./job3HomeSection";
import Job3NewsLetter from "./job3NewsLetter";
import JobOpeningAndAbout from "./jobOpeningAndAbout";
import TopCompany from "./topCompany";

const JobDemo3Container = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProductApiData());
    dispatch(fetchCategoryApiData());
  }, [dispatch]);
  return (
    <>
      <Job3HomeSection />
      <LogoSection swiperClass='logo-job3-slider' title='World best companies are hiring on hire up' />
      <JobOpeningAndAbout />
      <ExploreByCity />
      <TopCompany />
      <InterViewQuestion />
      <Job3NewsLetter />
    </>
  );
};

export default JobDemo3Container;
