import styled from "styled-components";
import { Marker, Popup, FlyToInterpolator } from "react-map-gl";
import { easeCubic } from "d3-ease";
import { Room, Today, TextSnippet } from "@mui/icons-material";

import PhotoSlider from "./PhotoSlider";

const UserPin = ({
  pin,
  viewport,
  setViewport,
  currentPinId,
  setCurrentPinId,
}) => {
  const { id, location, date, latitude, longitude, description, photos } = pin;

  // show popup when marker is clicked and "attach" the popup to related marker
  // transition properties are for animation when jumping from one pin to another
  const handleMarkerClick = (id, latitude, longitude) => {
    setCurrentPinId(id);
    setViewport({
      ...viewport,
      latitude,
      longitude,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 800,
      transitionEasing: easeCubic,
    });
  };

  return (
    <Container>
      <Marker
        latitude={latitude}
        longitude={longitude}
        offsetLeft={-viewport.zoom * 3.5} //centering marker
        offsetTop={-viewport.zoom * 7} //centering marker
      >
        <Room
          style={{ fontSize: viewport.zoom * 7, cursor: "pointer" }} //scaling marker size with zoom
          color="warning"
          onClick={() => handleMarkerClick(id, latitude, longitude)}
        />
      </Marker>
      {id === currentPinId && (
        <Popup
          latitude={latitude}
          longitude={longitude}
          closeButton={true}
          closeOnClick={true}
          onClose={() => setCurrentPinId(null)}
          captureScroll={true}
          anchor="left"
          offsetTop={-viewport.zoom * 4} //adjust offset to marker
          offsetLeft={viewport.zoom * 3} //adjust offset to marker
        >
          <Wrapper>
            {photos.length > 0 && <PhotoSlider photos={photos} />}
            <Line>
              <Room color="warning" />
              <label>Location</label>
            </Line>
            <h3>{location}</h3>
            {date && (
              <>
                <Line>
                  <Today color="warning" />
                  <label>Date</label>
                </Line>
                <h4>{date}</h4>
              </>
            )}
            {description && (
              <>
                <Line>
                  <TextSnippet color="warning" />
                  <label>Description</label>
                </Line>
                <p>{description}</p>
              </>
            )}
          </Wrapper>
        </Popup>
      )}
    </Container>
  );
};

export default UserPin;

const Container = styled.div`
  .mapboxgl-popup {
    z-index: 2;
  }
`;

const Wrapper = styled.div`
  position: relative;
  width: 400px;
  padding: 12px;

  label {
    margin-left: 5px;
    font-size: 14px;
    font-weight: 500;
  }

  h3,
  h4,
  p {
    margin: 3px 0 0 26px;
    padding-left: 3px;
    color: #212121;
  }

  h3 {
    font-size: 18px;
    font-weight: 500;
  }
  h4 {
    font-size: 15px;
    font-weight: 400;
  }

  .image-gallery-left-nav .image-gallery-svg,
  .image-gallery-right-nav .image-gallery-svg {
    width: 30px;
    height: 40px;
  }

  .image-gallery-left-nav,
  .image-gallery-right-nav {
    padding: 5px;
  }

  .image-gallery-fullscreen-button {
    padding: 7px;
    bottom: unset;
    top: 0;
  }

  .image-gallery {
    margin-bottom: 24px;
  }
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  color: #ed6c02;
  margin-top: 15px;
`;
