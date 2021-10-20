import React, { useContext, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { FlyToInterpolator } from 'react-map-gl';
import { easeCubic } from 'd3-ease';
import { motion } from 'framer-motion';
import { Cancel } from '@mui/icons-material';

import GlobalContext from '../context/GlobalContext';
import PinDetails from './PinDetails';
import AddPin from './AddPin';
import EditPin from './EditPin';

const Drawer = forwardRef((props, ref) => {
  const { currentPin } = useContext(GlobalContext);

  const {
    setViewport,
    setToggleDrawer,
    toggleAddPin,
    setToggleAddPin,
    toggleEditPin,
    setToggleEditPin,
  } = props;

  useImperativeHandle(ref, () => ({ handleDrawerClose }));

  // this function is defined here instead of the parent(MapPage) component
  // passing in viewport as prop will cause this component to re-render even when using React.memo.
  // as the viewport state is constantly changing when dragging the map
  // instead pass in setViewport as prop and use its prev state to avoid unnecessary re-render
  const handleDrawerClose = () => {
    // set pin to centre of viewport
    if (currentPin) {
      setViewport((prev) => ({
        ...prev,
        latitude: currentPin.latitude,
        longitude: currentPin.longitude,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 800,
        transitionEasing: easeCubic,
      }));
    }
    setToggleDrawer(false);
  };

  console.log('Drawer');

  return (
    <Container
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ duration: 0.5 }}
    >
      <Wrapper>
        {toggleAddPin ? (
          <AddPin
            handleDrawerClose={handleDrawerClose}
            setToggleAddPin={setToggleAddPin}
          />
        ) : toggleEditPin ? (
          <EditPin
            setToggleAddPin={setToggleAddPin}
            setToggleEditPin={setToggleEditPin}
          />
        ) : (
          currentPin && (
            <PinDetails
              handleDrawerClose={handleDrawerClose}
              setToggleEditPin={setToggleEditPin}
            />
          )
        )}
      </Wrapper>
      <CanelIcon onClick={handleDrawerClose}>
        <Cancel />
      </CanelIcon>
    </Container>
  );
});

export default React.memo(Drawer);

const Container = styled(motion.div)`
  cursor: initial;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: #fff;
  width: 450px;
  height: 100%;
  padding: 30px 20px;
  box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%),
    0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
  overflow-y: auto;
  direction: rtl;

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 100px;
    background: #9e9e9e;
  }

  @media (max-width: 768px) {
    padding: 30px 10px;
  }

  @media (max-width: 450px) {
    width: 100%;
  }
`;

const Wrapper = styled.div`
  position: relative;
  padding: 0 20px 10px 20px;
  direction: ltr;
`;

const CanelIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #ed6c02;
  cursor: pointer;
`;
