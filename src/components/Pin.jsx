import React from 'react';
import styled from 'styled-components';
import { useContext } from 'react';
import { Marker, FlyToInterpolator } from 'react-map-gl';
import { easeCubic } from 'd3-ease';
import { Room } from '@mui/icons-material';

import GlobalContext from '../context/GlobalContext';

const Pin = ({ pin, setViewport, setTogglePinDetails }) => {
  const { setCurrentPin } = useContext(GlobalContext);

  // show popup when marker is clicked and "attach" the popup to related marker
  // transition properties are for animation when jumping from one pin to another
  const handleMarkerClick = () => {
    setCurrentPin(pin);
    setTogglePinDetails(true);
    setViewport((prevState) => ({
      ...prevState,
      zoom: 12,
      latitude: pin.latitude,
      longitude: pin.longitude - 0.000085 * 450, //offset viewport(pin to centre of map) when sidebar toggled
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 800,
      transitionEasing: easeCubic,
    }));
  };

  console.log('Marker');

  return (
    <Marker
      latitude={pin.latitude}
      longitude={pin.longitude}
      offsetLeft={-15} //centering marker
      offsetTop={-30} //centering marker
    >
      <Room
        style={{ fontSize: 30, cursor: 'pointer' }}
        color='warning'
        onClick={handleMarkerClick}
      />
    </Marker>
  );
};

export default React.memo(Pin);
