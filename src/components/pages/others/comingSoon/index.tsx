"use client";
import { ImagePath } from '@/constants';
import { SocialLinks } from '@/data/pages/Others';
import RatioImage from '@/utils/RatioImage';
import { RouteList } from '@/utils/RouteList';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button, Col, Container, Input, InputGroup, Row } from 'reactstrap';

const ComingSoonContainer = () => {
    return (
        <>
            <header className="px-0">
                <Container>
                    <div className="header-flex">
                        <div className="left-side-header w-100 justify-content-between">
                            <Link href={RouteList.Home.CarDemo1} className="header-logo">
                                <Image height={30} width={110} src={`${ImagePath}/logo/1.png`} alt="logo" className="img-fluid" />
                            </Link>
                            <ul className="coming-soon-link">
                                <li>
                                    <Link href={RouteList.Pages.Other.AboutUs1}>About Us</Link>
                                </li>
                                <li>
                                    <Link href={RouteList.Pages.Other.ContactUs1}>Contact Us</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Container>
            </header>
            <section className="pt-0 coming-soon-section">
                <RatioImage src={`${ImagePath}/other/coming-soon.jpg`} alt="coming-soon" className="img-fluid bg-img" />
                <Container className="h-100">
                    <Row className="justify-content-center text-center align-items-center h-100">
                        <Col lg={8}>
                            <div className="coming-soon-content">
                                <h2>We are Coming Soon!</h2>
                                <p>Get ready, We are right now working on something extraordinarily amazing; our website will be
                                    live immediately.</p>
                                <InputGroup>
                                    <Input type="email" placeholder="Your mail address" />
                                    <Button className="btn-solid">Subscribe</Button>
                                </InputGroup>
                            </div>
                        </Col>
                    </Row>
                    <div className="copyright">
                        <Container>
                            <div className="copyright-flex">
                                <p>@ 2025 All Rights Reserved</p>
                                <ul className="social-list">
                                    <li>Social Link :</li>
                                    {SocialLinks.map((Item, index) => (
                                        <li key={index}>
                                            <Link href={Item.url} target="_blank"><i className={Item.icon} /></Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Container>
                    </div>
                </Container>
            </section>
        </>
    )
}
export default ComingSoonContainer;