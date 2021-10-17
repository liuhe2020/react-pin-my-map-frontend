import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { FlyToInterpolator } from 'react-map-gl';
import { easeCubic } from 'd3-ease';
import Button from '@mui/material/Button';
import { Room, Cancel, Today, TextSnippet, Photo } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

import EditPin from './EditPin';
import Gallery from './Gallery';
import GlobalContext from '../context/GlobalContext';

const PinDetails = ({ setViewport, setTogglePinDetails }) => {
  const { authUser, setIsLoading, currentPin, setPins } =
    useContext(GlobalContext);

  const [pin, setPin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toggleDelete, setToggleDelete] = useState(false);

  // set local pin to context currentPin
  // in EditPin.jsx, currentPin gets updated after each edit which will trigger a re-render in this useEffect
  // this normally happens automatically but not when using React.memo
  useEffect(() => {
    setPin(currentPin);
  }, [currentPin]);

  const handlePinDetailsClose = () => {
    setTogglePinDetails(false);
    // set pin to centre of viewport
    setViewport((prev) => ({
      ...prev,
      latitude: currentPin.latitude,
      longitude: currentPin.longitude,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 800,
      transitionEasing: easeCubic,
    }));
  };

  const handleDelete = async () => {
    setIsLoading(true);

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/pins/${currentPin.id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authUser.jwt}` },
      }
    );

    if (res.status !== 200) {
      toast.error('Network error. Please try again later.');
    } else {
      const data = await res.json();
      setPins((prev) => prev.filter((pin) => pin.id !== data.id));
      handlePinDetailsClose();
      setIsEditing(false);
      setToggleDelete(false);
      toast.success(`${currentPin.location} - Deleted`);
    }

    setIsLoading(false);
  };

  console.log('Pin Details');

  return (
    <MotionContainer
      as={motion.div}
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween' }}
    >
      {/* <Popup
        latitude={latitude}
        longitude={longitude}
        closeButton={true}
        closeOnClick={isEditing ? false : true}
        onClose={handlePinClose}
        captureScroll={true}
        anchor="left"
        // offsetTop={-viewport.zoom * 4} //adjust offset to marker
        // offsetLeft={viewport.zoom * 3} //adjust offset to marker
      > */}
      {!isEditing && pin !== null && (
        <Wrapper>
          <Details>
            <Line style={{ paddingTop: '10px' }}>
              <Room color='warning' />
              <label>Location</label>
            </Line>
            <h3>{pin.location}</h3>
            {pin.date && (
              <>
                <Line>
                  <Today color='warning' />
                  <label>Date</label>
                </Line>
                <h4>{pin.date}</h4>
              </>
            )}
            {pin.description && (
              <>
                <Line>
                  <TextSnippet color='warning' />
                  <label>Description</label>
                </Line>
                <p>{pin.description}</p>
              </>
            )}
            {pin.photos.length > 0 && (
              <>
                <Line>
                  <Photo color='warning' />
                  <label>Gallery</label>
                </Line>
                <Gallery pin={pin} />
              </>
            )}
          </Details>
          {authUser && (
            <ButtonWrapper>
              <Button
                variant='contained'
                size='small'
                color='error'
                onClick={() => setToggleDelete(true)}
              >
                Delete
              </Button>
              <Button
                variant='contained'
                size='small'
                color='primary'
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </ButtonWrapper>
          )}
          {toggleDelete && (
            <Delete>
              <p>Are you sure you want to delete {pin.location}?</p>
              <div>
                <Button
                  variant='contained'
                  size='small'
                  color='primary'
                  onClick={() => setToggleDelete(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  size='small'
                  color='error'
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </Delete>
          )}
        </Wrapper>
      )}
      {isEditing && (
        <Wrapper>
          <EditPin setIsEditing={setIsEditing} />
        </Wrapper>
      )}
      <CanelIcon onClick={handlePinDetailsClose}>
        <Cancel />
      </CanelIcon>
    </MotionContainer>
  );
};

export default React.memo(PinDetails);

const MotionContainer = styled(motion.div)`
  cursor: initial;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: #fff;
  width: 450px;
  height: 100%;
  box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%),
    0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);

  @media (max-width: 450px) {
    width: 100%;
  }
`;

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  padding: 5px 20px 20px 20px;
  overflow-y: auto;
  direction: rtl;

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 100px;
    background: #9e9e9e;
  }
`;

const Details = styled.div`
  direction: ltr;

  label {
    margin-left: 5px;
    font-size: 14px;
    font-weight: 500;
  }

  h3,
  h4,
  p {
    margin: 3px 19px 0 29px;
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
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  color: #ed6c02;
  margin-top: 20px;
`;

const ButtonWrapper = styled.div`
  text-align: center;
  margin-top: 40px;

  button {
    margin: 5px;
  }
`;

const Delete = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 95%;
  height: 100%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;

  button {
    margin: 10px 5px;
  }
`;

const CanelIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #ed6c02;
  cursor: pointer;
`;
