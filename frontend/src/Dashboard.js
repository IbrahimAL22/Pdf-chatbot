import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import slideImage1 from './assets/First.png';
import slideImage2 from './assets/second.png';
import slideImage3 from './assets/third.png';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f7f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 90vh;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  color: #000000;
  font-size: 2.5rem;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin: 20px 0;
  text-align: center;
`;

const StartButton = styled(Link)`
  padding: 10px 20px;
  background-color: #000000;
  color: white;
  border-radius: 20px;
  text-decoration: none;
  font-size: 1.2rem;
  margin-top: 40px; /* Reduced margin */
  
  &:hover {
    background-color: #BED3AB;
  }
`;

const SlideContainer = styled.div`
  margin-top: 10px; /* Reduced margin */
  width: 100%;
`;

const SlideImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const SlideVideo = styled.video`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const slides = [
  {
    id: 1,
    type: "image",
    content: slideImage1
  },
  {
    id: 2,
    type: "image",
    content: slideImage2
  },
  {
    id: 3,
    type: "image",
    content: slideImage3
  }
];

function Dashboard() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <Container>
      <Title>Welcome to ChatterGPT</Title>
      <Description>
        A powerful tool to interact with your PDFs using intelligent conversations.
        Whether you're trying to extract insights from documents, perform advanced 
        searches, or just need a fast way to analyze content, ChatterGPT makes it easy.
        Explore various features like keyword highlighting, summary generation, and 
        interactive Q&A tailored to your specific document needs.
      </Description>

      <SlideContainer>
        <Slider {...settings}>
          {slides.map(slide => (
            <div key={slide.id}>
              {slide.type === "image" ? (
                <SlideImage src={slide.content} alt={`Slide ${slide.id}`} />
              ) : (
                <SlideVideo controls>
                  <source src={slide.content} type="video/mp4" />
                  Your browser does not support the video tag.
                </SlideVideo>
              )}
            </div>
          ))}
        </Slider>
      </SlideContainer>

      <StartButton to="/upload">Get Started</StartButton>
    </Container>
  );
}

export default Dashboard;
