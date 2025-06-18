import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" className="logo"/>
            <p>getmeds is the best platform to buy medicines</p>
            <div className="footer-social-icons">   
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />

                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privarcy Policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2> Contact Us</h2>
                <ul>
                    <li>+91 1234567890</li>
                    <li>getmedsweb@gmail.com</li>
                </ul>

            </div>
        </div>
            <hr/>
            <p className='footer-copyright'>© 2023 Getmeds. All rights reserved.</p>
    </div>
  )
}

export default Footer
