import React, { useEffect } from "react";
import Banner from "./Banner";
import Advantages from "./Advantages";
import DealOfTheDay from "./DealOfTheDay";
import HomeAds1 from "./HomeAds1";
import Categories from './Categories';
import HomeAds2 from './HomeAds2';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <header>
        <Header />
      </header>

      <div className="home-content">
        <div className="main">
          <Banner />
          <Advantages />
          <DealOfTheDay />
          <HomeAds1 />
          <Categories />
          <HomeAds2 />
          {/* 
                
                
                
                <Categories />
                */}
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </>

  );
};

export default HomePage;
