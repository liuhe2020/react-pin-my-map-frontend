import { useState, useContext } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import ReactMapGL, { FlyToInterpolator } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { easeCubic } from 'd3-ease';
import Button from '@mui/material/Button';
import { ExitToApp } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';

import GlobalContext from '../context/GlobalContext';
import Pin from '../components/Pin';
import PinDetails from '../components/PinDetails';
import AddPin from '../components/AddPin';
import Loader from '../components/Loader';
import SocialShare from '../components/SocialShare';

const MapPage = () => {
  const { pins, authUser, setAuthUser, isLoading, currentPin } =
    useContext(GlobalContext);
  const [togglePinDetails, setTogglePinDetails] = useState(false);
  const [newCoord, setNewCoord] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 46,
    longitude: 17,
    zoom: 4,
    minZoom: 1.585, // limit zoom out to single world map
    maxZoom: 19,
  });

  if (!authUser) return <Redirect to='/' />;

  const handlePinDetailsClose = () => {
    setTogglePinDetails(false);
    setNewCoord(null);
    // set pin to centre of viewport
    setViewport({
      ...viewport,
      latitude: currentPin.latitude,
      longitude: currentPin.longitude,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 800,
      transitionEasing: easeCubic,
    });
  };

  // create a new marker & popup at clicked location
  const handleMapDblClick = (e) => {
    const [long, lat] = e.lngLat;
    console.log(e.lngLat);
    setNewCoord({ lat, long });
  };

  const handleLogout = () => {
    localStorage.removeItem('pin-my-map-user');
    setAuthUser(null);
  };

  return (
    <Container>
      <Helmet>
        <title>
          {authUser && `Pin My Map | ${authUser.user.username}'s map`}
        </title>
        <meta
          name='description'
          content="Pin My Map user's map page. Add, edit, update and delete pins on map."
        />
      </Helmet>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={setViewport}
        mapStyle='mapbox://styles/liuhe2020/cktu2h4q70wil17m6umh33a9i'
        onClick={handlePinDetailsClose}
        onDblClick={handleMapDblClick}
      >
        {pins &&
          pins.map((pin) => (
            <Pin
              key={pin.id}
              pin={pin}
              setViewport={setViewport}
              setTogglePinDetails={setTogglePinDetails}
            />
          ))}
        {isLoading && <Loader />}
      </ReactMapGL>
      <AnimatePresence>
        {togglePinDetails && (
          <PinDetails
            setTogglePinDetails={setTogglePinDetails}
            setViewport={setViewport}
          />
        )}
        {newCoord && <AddPin newCoord={newCoord} setNewCoord={setNewCoord} />}
      </AnimatePresence>
      <ButtonWrapper>
        <SocialShare id={authUser.user.id} />
        <Button
          variant='contained'
          size='small'
          color='warning'
          onClick={handleLogout}
        >
          <ExitToApp style={{ fontSize: '20px', marginRight: '3px' }} />
          Log out
        </Button>
      </ButtonWrapper>
    </Container>
  );
};

export default MapPage;

const Container = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  display: flex;
  top: 10px;
  right: 10px;

  button {
    margin: 5px;
  }
`;
