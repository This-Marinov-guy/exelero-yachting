import { ImagePath, MeetOurTeam, SVGPath } from "@/constants";
import { SocialIcons } from "@/data/job";
import { AboutTeamData, AboutTeamSlider } from "@/data/pages/Others";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";

const TeamAbout = () => {
  return (
    <section className='property2-team-section car-about-team section-b-space'>
      <Container>
        <div className='detail-flex-title'>
          <h2>{MeetOurTeam}</h2>
          <div className='swiper-flex car-arrow'>
            <div className='swiper-button-prev about-team-prev'>
              <ArrowLeft2 className='iconsax' color='white' size={24} />
            </div>
            <div className='swiper-button-next about-team-next'>
              <ArrowRight2 className='iconsax' color='white' size={24} />
            </div>
          </div>
        </div>
        <Swiper {...AboutTeamSlider} className='about-team-slider ratio_square'>
          {AboutTeamData.slice(0, 9).map((item, i) => {
            return (
              <SwiperSlide key={i}>
                <div className='team-box'>
                  <div className='team-img'>
                    <Image width={251} height={251} src={`${ImagePath}/${item.image}`} alt='t-1' className='bg-img' unoptimized/>
                    <ul className='team-social'>
                      {SocialIcons.map((item, i) => {
                        return (
                          <li key={i}>
                            <Link href={item.url} target='_blank'>
                              <img src={`${SVGPath}/property2/team/${i + 1}.svg`} alt={`${i + 1}-item`} className='img-fluid' />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className='team-content'>
                    <h5>{item.name}</h5>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Container>
    </section>
  );
};

export default TeamAbout;
