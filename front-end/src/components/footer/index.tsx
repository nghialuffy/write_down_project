import React from 'react'
import './style.scss';
import {MailOutlined ,HomeOutlined} from '@ant-design/icons';
import logo from './../../assets/logo.png'

export function Footer() {
   return (
      <div className="page-footer">
         <div className="container">
            <div className="column">
               <h2 className="title"><img src={logo} alt='Write Down logo' className='logo'/>WRITE DOWN</h2>
               <p>Website để mọi người có thể chia sẻ các kiến thức của mình. Đồng thời cũng là nơi để mọi người bình luận, chia sẻ ý kiến về các vấn đề trong cuộc sống.</p>
            </div>
            <div className="column">
               <h2 className="title">CONTACT US</h2>
               <p className='row-info'><MailOutlined /> Email: <a href="mailto:levannghia32@gmail.com">levannghia32@gmail.com</a></p>
               <p className='row-info'><HomeOutlined /> Đại học Bách khoa Đà Nẵng</p>
            </div>
         </div>
         <div className="container copyright">© 2020 Copyright: <img src={logo} alt='Write Down Team' className='small-logo'/>
            <a href="https://github.com/nghialuffy/write_down_project">Write Down Team</a>
         </div>
      </div>
   );
}