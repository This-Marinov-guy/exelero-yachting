import { ContactInfoTitle, ImagePath } from '@/constants'
import { DetailBodyItemType } from '@/types/Product'
import { Call, CallCalling, Location } from 'iconsax-react'
import Image from 'next/image'
import React, { FC } from 'react'

const ContactDetail:FC<DetailBodyItemType> = ({type}) => {
  return (
    <div className='detail-sidebar-box'>
    <h4 className={`${type === 'car' ? 'car-title':'detail-page-title'}`}>{ContactInfoTitle}</h4>
    <div className='profile-title'>
      <div className='profile-img'>
        <Image height={50} width={50} src={`${ImagePath}/job/job-box/3.jpg`} alt='j-3' className='img-fluid' />
      </div>
      <div className='profile-name'>
        <h6>Albert Crawford</h6>
        <span>contact@gmail.com</span>
      </div>
    </div>
    <ul className='location-list'>
      <li className='location-item'>
        <Location className='iconsax' color='rgb(125 130 134)' size={18}/>
        <span>Meester Westerhofdijk</span>
      </li>
      <li className='location-item'>
        <CallCalling className='iconsax' size={18} color='rgb(125 130 134)'/>
        <span>(401) 531-6404</span>
      </li>
    </ul>
  </div>
  )
}

export default ContactDetail