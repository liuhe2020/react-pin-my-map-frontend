import styled from "styled-components";
import { useState } from "react";
import { Marker, Popup, FlyToInterpolator } from "react-map-gl";
import { easeCubic } from "d3-ease";
import { Room, Today, TextSnippet } from "@mui/icons-material";
import Button from "@mui/material/Button";

import EditPin from "./EditPin";
import PhotoSlider from "./PhotoSlider";

const Pin = ({ pin, viewport, setViewport, currentPinId, setCurrentPinId }) => {
  const [isEditing, setIsEditing] = useState(false);
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

  // close popup when clicked outside (disabled while editing pin)
  const handlePinClose = () => {
    setCurrentPinId(null);
    setIsEditing(false);
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
          closeOnClick={isEditing ? false : true}
          onClose={handlePinClose}
          captureScroll={true}
          offsetTop={-viewport.zoom * 4} //adjust offset to marker
          offsetLeft={viewport.zoom * 3} //adjust offset to marker
        >
          {!isEditing && (
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
              <ButtonWrapper>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button variant="contained" size="small" color="error">
                  Delete
                </Button>
              </ButtonWrapper>
            </Wrapper>
          )}
          {isEditing && (
            <EditPin
              pin={pin}
              setCurrentPinId={setCurrentPinId}
              setIsEditing={setIsEditing}
            />
          )}
        </Popup>
      )}
    </Container>
  );
};

export default Pin;

const Container = styled.div`
  .mapboxgl-popup {
    z-index: 2;
  }
`;

const Wrapper = styled.div`
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
    margin: 3px 0 15px 26px;
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
`;

const ButtonWrapper = styled.div`
  text-align: center;

  button {
    margin: 5px;
  }
`;
