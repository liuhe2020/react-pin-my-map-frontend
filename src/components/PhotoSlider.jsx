import { useState } from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Lightbox from "./Lightbox";

const PhotoSlider = ({ photos }) => {
  // const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: null,
  });

  const photoUrls = photos.map((photo) => ({
    thumbnail: photo.formats.thumbnail.url,
    original: photo.url,
  }));

  const settings = {
    swipeToSlide: true,
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  const openLightboxOnSlide = (e) => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: Number(e.target.getAttribute("data-index")) + 1,
    });
  };
  // const handleLightboxOpen = (e) => {
  //   setPhotoIndex(Number(e.target.getAttribute("data-index")));
  //   setIsLightboxOpen(true);
  // };

  return (
    <>
      <Container>
        <Slider {...settings}>
          {photoUrls.map((url, index) => (
            <PhotoWrapper key={index}>
              <img
                src={url.thumbnail}
                data-index={index}
                alt=""
                onClick={openLightboxOnSlide}
              />
            </PhotoWrapper>
          ))}
          {/* slick slider needs 3 div/img minimum to work */}
          {photoUrls.length < 3 && <PhotoWrapper />}
          {photoUrls.length < 3 && <PhotoWrapper />}
        </Slider>
        <Lightbox
          lightboxController={lightboxController}
          photoUrls={photoUrls}
        />
      </Container>
    </>
  );
};

export default PhotoSlider;

const Container = styled.div`
  margin-bottom: 30px;

  .slick-dots li.slick-active button:before {
    color: #ed6c02;
  }

  .slick-dots li button:before {
    font-size: 10px;
  }
`;

const PhotoWrapper = styled.div`
  img {
    width: 126px;
    height: 126px;
    object-fit: cover;
    object-position: center;
  }
`;
