import React from 'react'
import './style.scss';
import 'src/logo.svg'

export function Footer() {
   return (
      <div className="page-footer">
         <div className="container">
            <div className="column">
               <h2 className="title">WRITE DOWN</h2>
               <p>Xây dựng một website để mọi người có thể chia sẻ các kiến thức của mình. Đồng thời cũng là nơi để mọi người bình luận, chia sẻ ý kiến về các vấn đề trong cuộc sống.</p>
            </div>
            <div className="column">
               <h2 className="title">CONTACT US</h2>
               <p>Email: <a href="mailto:levannghia32@gmail.com">levannghia32@gmail.com</a></p>
               <p>Đại học Bách khoa Đà Nẵng</p>
            </div>
         </div>
         <div className="container copyright">© 2020 Copyright:
            <a href="https://github.com/nghialuffy/write_down_project">
               <img src='src/logo.svg' alt='Write Down Team' />
            </a>
         </div>
      </div>
   );
}