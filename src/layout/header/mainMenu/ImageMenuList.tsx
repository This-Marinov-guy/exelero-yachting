import { ImagePath } from "@/constants";
import { MainMenu } from "@/types/Layout";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";

const ImageMenuList: React.FC<MainMenu> = ({ mainMenu,toggleMain }) => {
  const { t } = useTranslation('common');
  return (
    <Fragment>
      <div className='mega-menu sample'>
        <Row xl={4} xs={1} className='gy-4'>
          {mainMenu.map((child, index) => (
            <Col key={index}>
              <Link href={child.path ? child.path : RouteList.Home.CarDemo1} className='demo-box' onClick={toggleMain}>
                <div className='demo-img'>
                  <div className='overflow-hidden'>
                    <Image src={`${ImagePath}/${child.image}`} height={223} width={294} alt='demo-1' />
                  </div>
                </div>
                <h6>{t(child.title?child.title:'')}</h6>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </Fragment>
  );
};

export default ImageMenuList;
