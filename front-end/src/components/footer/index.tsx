import React from 'react'
import './style.scss';
import logo from './../../assets/logo.png'
import email from './../../assets/icon-mail.svg'
import home from './../../assets/icon-home.svg'
export function Footer() {
   return (
      <div className="page-footer">
         <div className="container">
            <div className="column">
               <h2 className="title"><img src={logo} alt='Write Down Team' height="40px" width="40px" />WRITE DOWN</h2>
               <p>Website để mọi người có thể chia sẻ các kiến thức của mình. Đồng thời cũng là nơi để mọi người bình luận, chia sẻ ý kiến về các vấn đề trong cuộc sống.</p>
            </div>
            <div className="column">
               <h2 className="title">CONTACT US</h2>
               <p><img src={email} alt='Email' height="20px" width="20px" /> Email: <a href="mailto:levannghia32@gmail.com">levannghia32@gmail.com</a></p>
               <p><img src={home} alt='Home' height="20px" width="20px" /> Đại học Bách khoa Đà Nẵng</p>
            </div>
         </div>
         <div className="container copyright">© 2020 Copyright: <img src={logo} alt='Write Down Team' height="30px" width="30px" />
            <a href="https://github.com/nghialuffy/write_down_project">Write Down Team</a>
         </div>
      </div>
   );
}