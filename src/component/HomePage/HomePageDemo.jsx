'use client'

import React, { useState, useEffect, useRef, useContext } from 'react'
import { Moon, Search, X, ChevronLeft, ChevronDown, Facebook, Twitter, Instagram } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { postLogin, postRegister } from '../../untills/api'
import { AuthContext } from '../../untills/context/AuthContext'
import SalesStatistics from './SalesStatistics'
import CustomerSatisfaction from './CustomerSatisfaction'
import OTPVerification from './OTPVerification'
import AuthPanel from './AuthPanel';

export default function SupermarketLanding() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const banners = [
    {
      "id": 1,
      "image": "https://res.cloudinary.com/dhpqoqtgx/image/upload/v1733951134/mpjrkfiymrdhgqbdu1tn.png",
      "title": "C'Mart Supermarket",
      "location": "Gò Vấp, HCM",
      "description": "C'Mart là siêu thị hiện đại, cung cấp một loạt các sản phẩm tươi ngon, thực phẩm chế biến sẵn và hàng tiêu dùng đa dạng. Với không gian rộng rãi, sáng tạo, C'Mart mang đến cho khách hàng một trải nghiệm mua sắm thuận tiện và thú vị. Siêu thị đặc biệt chú trọng vào chất lượng sản phẩm và dịch vụ khách hàng, với các chương trình khuyến mãi hấp dẫn và dịch vụ giao hàng tận nơi.",
      "likes": "10K"
    },
  
    {
      "id": 2,
      "image": "https://res.cloudinary.com/dhpqoqtgx/image/upload/v1733951451/uzscmwtv6i9t4vdwypno.png",
      "title": "Không gian Siêu thị C'Mart",
      "location": "Gò Vấp, HCM",
      "description": "Không gian siêu thị C'Mart được thiết kế hiện đại và rộng rãi, tạo cảm giác thoải mái và thuận tiện cho khách hàng trong suốt quá trình mua sắm. Các khu vực trưng bày sản phẩm được sắp xếp hợp lý, từ thực phẩm tươi sống đến các mặt hàng tiêu dùng đa dạng. Đặc biệt, không gian của siêu thị còn có các khu vực dành riêng cho các chương trình khuyến mãi, giúp khách hàng dễ dàng tiếp cận các sản phẩm ưu đãi.",
      "likes": "10K"
    },
    
    {
      "id": 3,
      "image": "https://res.cloudinary.com/dhpqoqtgx/image/upload/v1733951756/ytl9dvkleu8q4rkzn0mg.png",
      "title": "Chương trình khuyến mãi C'Mart",
      "location": "Gò Vấp, HCM",
      "description": "C'Mart luôn mang đến các chương trình khuyến mãi hấp dẫn giúp khách hàng tiết kiệm chi phí mua sắm. Các chương trình hiện tại bao gồm giảm giá hóa đơn, giảm theo phần trăm (%), và mua hàng tặng quà. Các chương trình này giúp khách hàng có thêm nhiều lựa chọn tiết kiệm và nhận quà tặng đặc biệt khi mua sắm tại siêu thị.",
      "likes": "10K"
    },
    
    {
      "id": 4,
      "image": "https://res.cloudinary.com/dhpqoqtgx/image/upload/v1733952061/yceq00niaz4evbod5mak.png",
      "title": "Đội ngũ nhân viên C'Mart",
      "location": "Gò Vấp, TP.HCM",
      "description": "Đội ngũ nhân viên C'Mart luôn tận tâm và chuyên nghiệp, sẵn sàng hỗ trợ khách hàng trong mọi tình huống. Với thái độ phục vụ nhiệt tình và sự am hiểu về sản phẩm, nhân viên của C'Mart đảm bảo mang đến cho khách hàng một trải nghiệm mua sắm dễ chịu và hiệu quả. Đội ngũ được đào tạo bài bản để đáp ứng mọi nhu cầu từ tư vấn sản phẩm, hỗ trợ giao hàng đến giải quyết vấn đề phát sinh.",
      "likes": "10K"
    }
    
    
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])


  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('User is already logged in');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white bg-opacity-80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <a href="#" className="text-4xl font-bold text-gray-800">C'Mart</a>
              <div className="hidden md:flex ml-16 space-x-8">
                {/* Navigation links can be added here if needed */}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <Moon size={20} />
              </button>
              <button 
                className="px-4 py-2 text-gray-800 border border-gray-800 rounded-full hover:bg-gray-100"
                onClick={() => setIsAuthOpen(true)}
              >
                Đăng nhập / Đăng ký
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Banner Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out"
          style={{ backgroundImage: `url(${banners[currentBanner].image})` }}
        >
        </div>

        {/* Search Bar */}
        {/* <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-xl px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products"
              className="w-full px-4 py-3 pl-12 rounded-full bg-white shadow-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div> */}

        {/* Banner Content */}
        <div className="absolute bottom-32 left-0 right-0 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 text-white mb-4">
                <span className="text-lg">{banners[currentBanner].location}</span>
              </div>
              <h1 className="text-6xl font-bold text-white mb-4">{banners[currentBanner].title}</h1>
              <p className="text-white text-opacity-90 text-lg max-w-xl">
                {banners[currentBanner].description}
              </p>
              <div className="mt-8 flex space-x-4">
                <button className="px-8 py-3 bg-white text-gray-800 rounded-full hover:bg-gray-100">
                  Shop Now
                </button>
                <button className="p-3 border border-white rounded-full text-white hover:bg-white hover:bg-opacity-10">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Selection Buttons */}
        <div className="absolute bottom-8 right-8 flex space-x-4">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              className={`w-16 h-16 border-2 ${index === currentBanner ? 'border-white' : 'border-gray-400'} overflow-hidden rounded-md focus:outline-none transition-all duration-300`}
              onClick={() => setCurrentBanner(index)}
            >
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Scroll Down Button */}
        <button 
          className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-transparent border-none text-white cursor-pointer animate-bounce"
          onClick={() => scrollToSection('introduction')}
        >
          <ChevronDown size={24} />
        </button>
      </div>

      {/* Introduction Section */}
      <section id="introduction" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Chào mừng bạn đến với siêu thị C'Mart</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 text-center">
            Siêu thị C'Mart là một hệ thống siêu thị hiện đại, được thiết kế với mục tiêu mang đến trải nghiệm mua sắm tiện lợi, tiết kiệm và đa dạng cho khách hàng.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <CustomerSatisfaction />
            <SalesStatistics />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Sản phẩm chất lượng</h3>
              <p className="text-gray-600">Chúng tôi chọn lọc những sản phẩm tốt nhất để đảm bảo khách hàng nhận được các mặt hàng chất lượng cao.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Giá cả hợp lý</h3>
              <p className="text-gray-600">Chính sách giá của chúng tôi đảm bảo bạn nhận được giá trị tốt nhất cho số tiền bỏ ra.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Chương trình khuyến mãi</h3>
              <p className="text-gray-600">Chương trình khuyến mãi luôn mang đến cho bạn những trải nghiệm bất ngờ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team and Project Section */}
      <section id="team" className="py-16 px-4">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Giới thiệu về hệ thống quản lý siêu thị</h2>
    <div className="mb-12">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Mô tả dự án</h3>
      <p className="text-lg text-gray-600 mb-4">
        Hệ thống quản lý siêu thị là một giải pháp toàn diện giúp các siêu thị tối ưu hóa quy trình quản lý hàng hóa, bán hàng và dịch vụ khách hàng. 
        Với mục tiêu giúp các nhà quản lý nắm bắt thông tin chính xác về tồn kho, doanh thu và các hoạt động của cửa hàng, hệ thống này được thiết kế để dễ dàng sử dụng và tích hợp với các hệ thống hiện tại.
      </p>
      <p className="text-lg text-gray-600 mb-4">
        Tính năng nổi bật của hệ thống bao gồm:
      </p>
      <ul className="list-disc pl-6 text-gray-600 mb-4">
        <li>Quản lý thông tin sản phẩm: nhập kho, xuất kho, kiểm kê định kỳ.</li>
        <li>Quản lý bán hàng: thanh toán nhanh chóng, theo dõi đơn hàng và báo cáo doanh thu.</li>
        <li>Chế độ khách hàng: tích điểm, chương trình khuyến mãi và chăm sóc khách hàng.</li>
        <li>Hệ thống báo cáo trực quan: giúp quản lý theo dõi hiệu quả hoạt động hàng ngày.</li>
      </ul>
    </div>
    <div className="bg-white rounded-lg shadow-md p-6">
      <h4 className="text-xl font-semibold text-gray-800 mb-2">Giáo viên hướng dẫn</h4>
      <p className="text-gray-600 mb-4">ThS Trần Thế Trung</p>
      <h4 className="text-xl font-semibold text-gray-800 mb-2">Thực hiện</h4>
      <ul className="list-disc pl-6 text-gray-600">
        <li>Bạch Văn Cường</li>
        <li>Nguyễn Khắc Cường</li>
      </ul>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      <div className="text-center">
        {/* <img src="https://toquoc.mediacdn.vn/280518851207290880/2021/11/1/photo-1-1635691121501262799727-1635727732728-16357277331631943025236.jpg" alt="Trần Thế Trung" className="w-40 h-40 rounded-full mx-auto mb-4 object-cover" /> */}
        <h3 className="text-xl font-semibold text-gray-800 mb-1">Trần Thế Trung</h3>
        <p className="text-gray-600">Giáo viên hướng dẫn</p>
      </div>
      <div className="text-center">
        {/* <img src="https://toquoc.mediacdn.vn/280518851207290880/2021/11/1/photo-1-1635691121501262799727-1635727732728-16357277331631943025236.jpg" alt="Bạch Văn Cường" className="w-40 h-40 rounded-full mx-auto mb-4 object-cover" /> */}
        <h3 className="text-xl font-semibold text-gray-800 mb-1">Bạch Văn Cường</h3>
        <p className="text-gray-600">Thực hiện</p>
      </div>
      <div className="text-center">
        {/* <img src="https://toquoc.mediacdn.vn/280518851207290880/2021/11/1/photo-1-1635691121501262799727-1635727732728-16357277331631943025236.jpg" alt="Nguyễn Khắc Cường" className="w-40 h-40 rounded-full mx-auto mb-4 object-cover" /> */}
        <h3 className="text-xl font-semibold text-gray-800 mb-1">Nguyễn Khắc Cường</h3>
        <p className="text-gray-600">Thực hiện</p>
      </div>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-sm text-gray-300">
              C'Mart là siêu thị đáng tin cậy của bạn, cung cấp sản phẩm chất lượng và dịch vụ hoàn hảo kể từ năm 2023.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-300 hover:text-white">Home</a></li>
                <li><a href="#" className="text-sm text-gray-300 hover:text-white">Products</a></li>
                <li><a href="#" className="text-sm text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-sm text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-sm text-gray-300">12 Nguyễn Văn Bảo ,p4, Gò Vấp, HCM</p>
              <p className="text-sm text-gray-300">City, 12 Nguyễn Văn Bảo ,p4, Gò Vấp, HCM</p>
              <p className="text-sm text-gray-300">Phone: 076 848 6006</p>
              <p className="text-sm text-gray-300">Email: bachcuong27@gmail.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <Twitter size={24} />
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-300">&copy; 2024 C'Mart. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Authentication Panel */}
      <AuthPanel 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          login(user);
          if (user.role === 'admin') {
            navigate('/UIManager');
          } else {
            navigate('/UIpageDemo');
          }
        }}
      />

      {showOTPVerification && (
        <OTPVerification 
          email={registrationEmail} 
          onSuccess={() => {
            setShowOTPVerification(false);
            setIsAuthOpen(false);
          }} 
        />
      )}
    </div>
  )
}

