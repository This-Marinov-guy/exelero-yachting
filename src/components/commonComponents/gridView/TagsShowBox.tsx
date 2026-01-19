import { Href } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeFilter, clearAllFilters } from "@/redux/reducers/FilterSlice";
import Link from "next/link";
import React from "react";

const TagsShowBox = () => {
  const dispatch = useAppDispatch();

  const { salaryStatus, jobAllCategory, JobWorkMode, JobCompanyType, JobEducation, JobCheck, JobLocation, JobTopCompanies, JobType } = useAppSelector((state) => state.filter);

  const selectedFilters = [
    { label: "salaryStatus", value: `${salaryStatus[0]}-${salaryStatus[1]}` },
    { label: "JobWorkMode", value: JobWorkMode },
     ...jobAllCategory.map((category) => ({ label: "jobAllCategory", value: category })),
     ...JobCompanyType.map((companyType) => ({ label: "JobCompanyType", value: companyType })),
     ...JobEducation.map((education) => ({ label: "JobEducation", value: education })),
     ...JobCheck.map((byCheck) => ({ label: "JobCheck", value: byCheck })),
     ...JobLocation.map((location) => ({ label: "JobLocation", value: location })),
     ...JobTopCompanies.map((company) => ({ label: "JobTopCompanies", value: company })), 
     ...JobType.map((jobType) => ({ label: "JobType", value: jobType }))];

  return (
    <article className='job-list-header'>
      <div className='filter-header'>
        <h4>Filters</h4>
        <div className='job-header-box'>
          <ul className='job-filter-list'>
            {selectedFilters.map((filter, index) => (
              <li key={index}>
                <Link scroll={false} href={Href} onClick={() => dispatch(removeFilter({ label: filter.label, value: filter.value }))} style={{ cursor: "pointer" }}>
                  {`${filter.label.replace(/([A-Z])/g, " $1").trim()} : ${filter.value}`}
                  <i className='ri-close-line' />
                </Link>
              </li>
            ))}
          </ul>
          <Link scroll={false} href={Href} className='text-btn' onClick={() => dispatch(clearAllFilters())}>
            Clear All
          </Link>
        </div>
      </div>
    </article>
  );
};

export default TagsShowBox;
