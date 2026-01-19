import { useAppDispatch } from "@/redux/hooks";
import { fetchCategoryApiData, fetchProductApiData } from "@/redux/reducers/ProductSlice";
import React, { useEffect } from "react";
import Job2HomeSection from "./job2HomeSection";
import LogoSection from "./logoSection";
import Categories from "../common/category";
import JobOpenings from "./jobOpenings";
import JobGoal from "./jobGoal";
import Job2Service from "./job2Service";
import PeopleReview from "./peopleReview";

const JobDemo2Container = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProductApiData());
    dispatch(fetchCategoryApiData());
  }, [dispatch]);

  return (
    <>
      <Job2HomeSection />
      <LogoSection />
      <Categories type="job-2"/>
      <JobOpenings/>
      <JobGoal/>
      <Job2Service/>
      <PeopleReview/>
    </>
  );
};

export default JobDemo2Container;
