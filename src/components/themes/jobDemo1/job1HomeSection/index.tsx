import React from "react";
import { Container } from "reactstrap";
import MainPage from "./MainPage";
import Job1Filter from "./Job1Filter";

const Job1HomeSection = () => {
  return (
    <div className='job-home-section'>
      <Container>
        <MainPage/>
        <Job1Filter/>
      </Container>
    </div>
  );
};

export default Job1HomeSection;
