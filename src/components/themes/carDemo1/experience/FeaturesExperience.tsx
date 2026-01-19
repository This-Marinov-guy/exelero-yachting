import { SVGPath } from '@/constants'
import { ExperienceCarData } from '@/data/demo/demo1'
import Image from 'next/image'
import React from 'react'
import { Col, Row } from 'reactstrap'

const FeaturesExperience = () => {
  return (
    <div className="experience-car-feature">
        <Row>
          {ExperienceCarData.map((item, index) => (
            <Col md="3" xs="6" className="p-0" key={index}>
              <div className="experience-box">
                <div className="experience-icon">
                  <Image height={40} width={40} src={`${SVGPath}/${item.icon}`} alt={`e-${index + 1}`} className="img-fluid" />
                </div>
                <div className="experience-content">
                  <h5>{item.label}</h5>
                  <h4>{item.value}</h4>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
  )
}

export default FeaturesExperience