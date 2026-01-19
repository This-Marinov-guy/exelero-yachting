import { CounterData } from "@/data/demo/propertyDemo2";
import React from "react";
import CountUp from "react-countup";
import { Container } from "reactstrap";

const Counter = () => {
  return (
    <div className='property2-counter-section'>
      <Container>
        <ul className='counter-list'>
          {CounterData.map((item, i) => {
            return (
              <li className='counter-box' key={i}>
                <div className='counter-flex'>
                  <CountUp duration={15} end={item.count} className='counter' /> {item?.k}
                  <i className='ri-add-line' />
                </div>
                <h5>{item.title}</h5>
              </li>
            );
          })}
        </ul>
      </Container>
    </div>
  );
};

export default Counter;
