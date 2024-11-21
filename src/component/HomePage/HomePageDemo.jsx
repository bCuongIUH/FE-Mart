'use client'

import { useState, useEffect, useRef } from 'react'
import { Moon, Search, X, ChevronLeft, ChevronDown, Facebook, Twitter, Instagram } from 'lucide-react'

export default function SupermarketLanding() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [activeAuthTab, setActiveAuthTab] = useState('login')
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0)
  const authPanelRef = useRef(null)

  const banners = [
    {
      id: 1,
      image: 'https://khoinguonsangtao.vn/wp-content/uploads/2021/12/anh-nen-may-tinh-sieu-xe-cyberpunk-1.jpg',
      title: 'CHOCOLATE HILLS',
      location: 'Bohol, Philippines',
      description: 'The Chocolate Hills are conical karst hills. These hills consist of Late Pliocene to Early Pleistocene, thin to medium bedded, sandy to rubbly marine limestone.',
      likes: '20.5K'
    },
    {
      id: 2,
      image: require('../../assets/img/ben-ngoai.png'),
      title: 'EL NIDO ISLAND',
      location: 'Palawan, Philippines',
      description: 'El Nido is known for its white-sand beaches, coral reefs, and as the gateway to the Bacuit archipelago, a group of islands with steep karst cliffs.',
      likes: '18.7K'
    },
    {
      id: 3,
      image: require('../../assets/img/ben-trong.png'),
      title: 'MAYON VOLCANO',
      location: 'Albay, Philippines',
      description: 'Mayon Volcano is an active stratovolcano famous for its perfect cone shape. It\'s the centerpiece of the Albay Biosphere Reserve.',
      likes: '15.2K'
    },
    {
      id: 4,
      image: 'https://cdn-media.sforum.vn/storage/app/media/ctvseocps123/hinh-nen-8d-60.jpg',
      title: 'BORACAY ISLAND',
      location: 'Aklan, Philippines',
      description: 'Boracay is a small island known for its resorts and beaches. It\'s popular for its white sand and clear waters, perfect for swimming and water sports.',
      likes: '22.1K'
    },
    {
      id: 5,
      image: 'https://cdn-media.sforum.vn/storage/app/media/ctvseocps123/hinh-nen-8d-45.jpg',
      title: 'SIARGAO ISLAND',
      location: 'Surigao del Norte, Philippines',
      description: 'Siargao is a tear-drop shaped island in the Philippine Sea. It\'s known as the "Surfing Capital of the Philippines" with its famous Cloud 9 reef break.',
      likes: '17.8K'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleOutsideClick = (e) => {
    if (authPanelRef.current && !authPanelRef.current.contains(e.target)) {
      setIsAuthOpen(false)
      setForgotPasswordStep(0)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white bg-opacity-80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <a href="#" className="text-2xl font-bold text-gray-800">SUPERMART</a>
              <div className="hidden md:flex ml-16 space-x-8">
                <a href="#" className="text-gray-800 font-medium">Home</a>
                <a href="#" className="text-gray-600 hover:text-gray-800" onClick={() => scrollToSection('introduction')}>Introduction</a>
                <a href="#" className="text-gray-600 hover:text-gray-800" onClick={() => scrollToSection('team')}>Team</a>
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
                Sign-up / Login
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
          {/* <div className="absolute inset-0 bg-black bg-opacity-30" /> */}
        </div>

        {/* Search Bar */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-xl px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products"
              className="w-full px-4 py-3 pl-12 rounded-full bg-white shadow-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

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
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Welcome to SuperMart</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 text-center">
            SuperMart is your one-stop shop for all your grocery needs. We pride ourselves on offering a wide selection of high-quality products, from fresh produce to household essentials, all at competitive prices.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Customer Satisfaction</h3>
              <img src="https://toquoc.mediacdn.vn/280518851207290880/2021/11/1/photo-1-1635691121501262799727-1635727732728-16357277331631943025236.jpg" alt="Customer Satisfaction Chart" className="w-full h-auto mb-4" />
              <p className="text-gray-600">Our commitment to quality and service has resulted in consistently high customer satisfaction rates.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Product Variety</h3>
              <img src="https://toquoc.mediacdn.vn/280518851207290880/2021/11/1/photo-1-1635691121501262799727-1635727732728-16357277331631943025236.jpg" alt="Product Variety Chart" className="w-full h-auto mb-4" />
              <p className="text-gray-600">We offer a wide range of products across multiple categories to meet all your shopping needs.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Products</h3>
              <p className="text-gray-600">We source the best products to ensure our customers receive top-quality items.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Competitive Prices</h3>
              <p className="text-gray-600">Our pricing strategy ensures you get the best value for your money.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Excellent Service</h3>
              <p className="text-gray-600">Our friendly staff is always ready to assist you with any queries or needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team and Project Section */}
      <section id="team" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Our Team and Project</h2>
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Graduation Project: Supermarket Management System</h3>
            <p className="text-lg text-gray-600 mb-4">
              Our team is working on a comprehensive Supermarket Management System as part of our graduation project. This system aims to streamline operations, improve inventory management, and enhance the overall shopping experience for our customers.
            </p>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Project Supervisor</h4>
              <p className="text-gray-600 mb-4">GVHD: Trần Thế Trung</p>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Team Members</h4>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Bạch Văn Cường</li>
                <li>Nguyễn Khắc Cường</li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img src="https://toquoc.mediacdn.vn/280518851207290880/2021/11/1/photo-1-1635691121501262799727-1635727732728-16357277331631943025236.jpg" alt="Trần Thế Trung" className="w-40 h-40 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Trần Thế Trung</h3>
              <p className="text-gray-600">Project Supervisor</p>
            </div>
            <div className="text-center">
              <img src="https://toquoc.mediacdn.vn/280518851207290880/2021/11/1/photo-1-1635691121501262799727-1635727732728-16357277331631943025236.jpg" alt="Bạch Văn Cường" className="w-40 h-40 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Bạch Văn Cường</h3>
              <p className="text-gray-600">Team Member</p>
            </div>
            <div className="text-center">
              <img src="https://toquoc.mediacdn.vn/280518851207290880/2021/11/1/photo-1-1635691121501262799727-1635727732728-16357277331631943025236.jpg" alt="Nguyễn Khắc Cường" className="w-40 h-40 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Nguyễn Khắc Cường</h3>
              <p className="text-gray-600">Team Member</p>
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
              <p className="text-sm text-gray-300">SuperMart is your trusted local supermarket, offering quality products and excellent service since 2023.</p>
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
              <p className="text-sm text-gray-300">123 Supermarket Street</p>
              <p className="text-sm text-gray-300">City, State 12345</p>
              <p className="text-sm text-gray-300">Phone: (123) 456-7890</p>
              <p className="text-sm text-gray-300">Email: info@supermart.com</p>
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
            <p className="text-sm text-gray-300">&copy; 2023 SuperMart. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Overlay */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsAuthOpen(false)} />
      )}

      {/* Authentication Panel */}
      <div 
        ref={authPanelRef}
        className={`fixed top-0 right-0 w-full md:w-1/3 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isAuthOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Authentication</h2>
            <button onClick={() => {setIsAuthOpen(false); setForgotPasswordStep(0);}} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          {forgotPasswordStep === 0 ? (
            <>
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <button 
                  className={`flex-1 py-2 rounded-md ${activeAuthTab === 'login' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setActiveAuthTab('login')}
                >
                  Login
                </button>
                <button 
                  className={`flex-1 py-2 rounded-md ${activeAuthTab === 'signup' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setActiveAuthTab('signup')}
                >
                  Sign Up
                </button>
              </div>
              {activeAuthTab === 'login' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input id="password" type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter your password" />
                  </div>
                  <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Log in</button>
                  <div className="text-center">
                    <button 
                      onClick={() => setForgotPasswordStep(1)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input id="signup-name" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700">Phone</label>
                    <input id="signup-phone" type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter your phone number" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input id="signup-email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input id="signup-password" type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Create a password" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input id="signup-confirm-password" type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Confirm your password" />
                  </div>
                  <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Sign up</button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              {forgotPasswordStep === 1 && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Forgot Password</h3>
                  <div className="space-y-2">
                    <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input id="forgot-email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter your email" />
                  </div>
                  <button onClick={() => setForgotPasswordStep(2)} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Send OTP</button>
                </>
              )}
              {forgotPasswordStep === 2 && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Enter OTP</h3>
                  <div className="space-y-2">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
                    <input id="otp" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter 6-digit OTP" maxLength={6} />
                  </div>
                  <button onClick={() => setForgotPasswordStep(3)} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Verify OTP</button>
                </>
              )}
              {forgotPasswordStep === 3 && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Reset Password</h3>
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                    <input id="new-password" type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input id="confirm-new-password" type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Confirm new password" />
                  </div>
                  <button onClick={() => {setForgotPasswordStep(0); setIsAuthOpen(false);}} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Reset Password</button>
                </>
              )}
              {forgotPasswordStep > 0 && (
                <button 
                  onClick={() => setForgotPasswordStep(prev => Math.max(0, prev - 1))}
                  className="flex items-center text-sm text-blue-600 hover:underline mt-4"
                >
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}