'use client'

import { useState, useEffect, useRef } from 'react'
import { Moon, Search, X, ChevronLeft } from 'lucide-react'
import './HomePageDemo.css'

const Input = (props) => <input {...props} className="hpd-input" />
const Label = ({ children, htmlFor }) => <label className="hpd-label" htmlFor={htmlFor}>{children}</label>
const Button = ({ children, className, ...props }) => <button className={`hpd-button ${className || ''}`} {...props}>{children}</button>

export default function HomePageDemo() {
  const [activeTab, setActiveTab] = useState('login')
  const allDestinations = [
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
      image: 'https://cdn-media.sforum.vn/storage/app/media/ctvseocps123/hinh-nen-8d-thumbnail.jpg',
      title: 'EL NIDO ISLAND',
      location: 'Palawan, Philippines',
      description: 'El Nido is known for its white-sand beaches, coral reefs, and as the gateway to the Bacuit archipelago, a group of islands with steep karst cliffs.',
      likes: '18.7K'
    },
    {
      id: 3,
      image: 'https://img4.thuthuatphanmem.vn/uploads/2020/06/22/hinh-nen-anime-cho-may-tinh_092518501.jpg',
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

  const [currentBanner, setCurrentBanner] = useState(allDestinations[0])
  const [visibleDestinations, setVisibleDestinations] = useState(allDestinations.slice(1, 4))
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0)
  const authPanelRef = useRef(null)

  useEffect(() => {
    const newVisibleDestinations = allDestinations.filter(dest => dest.id !== currentBanner.id).slice(0, 3)
    setVisibleDestinations(newVisibleDestinations)
  }, [currentBanner])

  const handleDestinationClick = (destination) => {
    setCurrentBanner(destination)
  }

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

  return (
    <div className="hpd-container">
      {/* Navigation */}
      <nav className="hpd-nav">
        <div className="hpd-nav-container">
          <div className="hpd-nav-content">
            <div className="hpd-nav-left">
              <a href="#" className="hpd-logo">LAKBAY</a>
              <div className="hpd-nav-links">
                <a href="#" className="hpd-nav-link hpd-nav-link-active">Home</a>
                <a href="#" className="hpd-nav-link">Destinations</a>
                <a href="#" className="hpd-nav-link">Offers</a>
                <a href="#" className="hpd-nav-link">About Us</a>
              </div>
            </div>
            <div className="hpd-nav-right">
              <button className="hpd-icon-button">
                <Moon size={20} />
              </button>
              <button 
                className="hpd-auth-button"
                onClick={() => setIsAuthOpen(true)}
              >
                Sign-up / Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hpd-hero">
        {/* Banner Image */}
        <div 
          className="hpd-banner"
          style={{ backgroundImage: `url(${currentBanner.image})` }}
        >
          <div className="hpd-banner-overlay" />
        </div>

        {/* Search Bar */}
        <div className="hpd-search-container">
          <div className="hpd-search-bar">
            <input
              // type="text"
              placeholder="Search Tourist spots"
              className="hpd-search-input"
            />
            <Search className="hpd-search-icon" size={20} />
          </div>
        </div>

        {/* Banner Content */}
        <div className="hpd-banner-content">
          <div className="hpd-banner-text">
            <div className="hpd-banner-location">
              <span>{currentBanner.location}</span>
            </div>
            <h1 className="hpd-banner-title">{currentBanner.title}</h1>
            <p className="hpd-banner-description">
              {currentBanner.description}
            </p>
            <div className="hpd-banner-buttons">
              <button className="hpd-explore-button">
                Explore
              </button>
              <button className="hpd-bookmark-button">
                <svg className="hpd-bookmark-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        <div className="hpd-thumbnail-gallery">
          {visibleDestinations.map((dest) => (
            <div
              key={dest.id}
              className="hpd-thumbnail"
              onClick={() => handleDestinationClick(dest)}
            >
              <div className="hpd-thumbnail-image-container">
                <img
                  src={dest.image}
                  alt={dest.title}
                  className="hpd-thumbnail-image"
                />
                <div className="hpd-thumbnail-overlay" />
              </div>
              <div className="hpd-thumbnail-info">
                <h3 className="hpd-thumbnail-title">{dest.title}</h3>
                <p className="hpd-thumbnail-location">{dest.location}</p>
              </div>
              <div className="hpd-thumbnail-likes">
                <span>{dest.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isAuthOpen && (
        <div className="hpd-overlay" />
      )}

      {/* Authentication Panel */}
      <div 
        ref={authPanelRef}
        className={`hpd-auth-panel ${isAuthOpen ? 'hpd-auth-panel-open' : ''}`}
      >
        <div className="hpd-auth-content">
          <div className="hpd-auth-header">
            <h2 className="hpd-auth-title">Authentication</h2>
            <button onClick={() => {setIsAuthOpen(false); setForgotPasswordStep(0);}} className="hpd-close-button">
              <X size={24} />
            </button>
          </div>
          {forgotPasswordStep === 0 ? (
            <div className="hpd-tabs">
              <div className="hpd-tabs-list">
                <button 
                  className={`hpd-tab-button ${activeTab === 'login' ? 'hpd-tab-active' : ''}`}
                  onClick={() => setActiveTab('login')}
                >
                  Login
                </button>
                <button 
                  className={`hpd-tab-button ${activeTab === 'signup' ? 'hpd-tab-active' : ''}`}
                  onClick={() => setActiveTab('signup')}
                >
                  Sign Up
                </button>
              </div>
              {activeTab === 'login' ? (
                <div className="hpd-form">
                  <div className="hpd-form-group">
                    <label className="hpd-label" htmlFor="email">Email</label>
                    <input id="email" className="hpd-input" placeholder="Enter your email" type="email" />
                  </div>
                  <div className="hpd-form-group">
                    <label className="hpd-label" htmlFor="password">Password</label>
                    <input id="password" className="hpd-input" placeholder="Enter your password"  />
               
                  </div>
                  <div className="hpd-text-center">
                    <button 
                      onClick={() => setForgotPasswordStep(1)}
                      className="hpd-forgot-password"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <button className="hpd-button hpd-full-width">Log in</button>
                 
                </div>
              ) : (
                <div className="hpd-form">
                  <div className="hpd-form-group">
                    <label className="hpd-label" htmlFor="signup-name">Name</label>
                    <input id="signup-name" className="hpd-input" placeholder="Enter your name" />
                  </div>
                  <div className="hpd-form-group">
                    <label className="hpd-label" htmlFor="signup-email">Email</label>
                    <input id="signup-email" className="hpd-input" placeholder="Enter your email" type="email" />
                  </div>
                  <div className="hpd-form-group">
                    <label className="hpd-label" htmlFor="signup-phone">Phone</label>
                    <input id="signup-phone" className="hpd-input" placeholder="Enter your phone number" type="tel" />
                  </div>
                  <div className="hpd-form-group">
                    <label className="hpd-label" htmlFor="signup-password">Password</label>
                    <input id="signup-password" className="hpd-input" placeholder="Create a password"  />
                  </div>
                  <div className="hpd-form-group">
                    <label className="hpd-label" htmlFor="signup-confirm-password">Confirm Password</label>
                    <input id="signup-confirm-password" className="hpd-input" placeholder="Confirm your password"  />
                  </div>
                  <button className="hpd-button hpd-full-width">Sign up</button>
                </div>
              )}
            </div>
          ) : (
            <div className="hpd-form">
              {forgotPasswordStep === 1 && (
                <>
                  <h3 className="hpd-form-title">Forgot Password</h3>
                  <div className="hpd-form-group">
                    <Label htmlFor="forgot-email">Email</Label>
                    <Input id="forgot-email" placeholder="Enter your email" type="email" />
                  </div>
                  <Button onClick={() => setForgotPasswordStep(2)} className="hpd-full-width">Send OTP</Button>
                </>
              )}
              {forgotPasswordStep === 2 && (
                <>
                  <h3 className="hpd-form-title">Enter OTP</h3>
                  <div className="hpd-form-group">
                    <Label htmlFor="otp">OTP</Label>
                    <Input id="otp" placeholder="Enter 6-digit OTP" maxLength={6} />
                  </div>
                  <Button onClick={() => setForgotPasswordStep(3)} className="hpd-full-width">Verify OTP</Button>
                </>
              )}
              {forgotPasswordStep === 3 && (
                <>
                  <h3 className="hpd-form-title">Reset Password</h3>
                  <div className="hpd-form-group">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" placeholder="Enter new password"  />
                  </div>
                  <div className="hpd-form-group">
                    <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                    <Input id="confirm-new-password" placeholder="Confirm new password"  />
                  </div>
                  <Button onClick={() => {setForgotPasswordStep(0); setIsAuthOpen(false);}} className="hpd-full-width">Reset Password</Button>
                </>
              )}
              <button 
                onClick={() => setForgotPasswordStep(prev => Math.max(0, prev - 1))}
                className="hpd-back-button"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
