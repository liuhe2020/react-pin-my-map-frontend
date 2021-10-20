import React from 'react';
import { useContext } from 'react';
import { Marker, FlyToInterpolator } from 'react-map-gl';
import { easeCubic } from 'd3-ease';
import { Room } from '@mui/icons-material';
import { styled as muiStyled } from '@mui/material/styles';

import GlobalContext from '../context/GlobalContext';

const Pin = ({
  pin,
  setViewport,
  setToggleDrawer,
  setToggleAddPin,
  setToggleEditPin,
}) => {
  const { setCurrentPin } = useContext(GlobalContext);

  // transition properties are for animation when jumping from one pin to another
  const handleMarkerClick = () => {
    setCurrentPin(pin);
    setToggleEditPin(false);
    setToggleAddPin(false);
    setToggleDrawer(true);
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
      <StyledRoomIcon color='warning' onClick={handleMarkerClick} />
    </Marker>
  );
};

export default React.memo(Pin);

const StyledRoomIcon = muiStyled(Room)`
  font-size: 30px;
  cursor: pointer;
`;
