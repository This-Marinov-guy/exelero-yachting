import { FC } from "react";
import CarDemoCategories from "./CarDemo";
import JobCategories from "./Job";
import PropertyCategories from "./Property";

const Categories: FC<{ type?: string }> = ({ type }) => {
  switch (type) {
    case "carDemo-1":
    case "carDemo-2":
      return <CarDemoCategories variant={type} />;
    case "job-1":
    case "job-2":
      return <JobCategories variant={type} />;
    case "property-1":
    case "property-2":
      return <PropertyCategories variant={type} />;
    default:
      return null;
  }
};

export default Categories;
