import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import ReactMapGL, { Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Button from "@mui/material/Button";
import { ExitToApp } from "@mui/icons-material";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

import GlobalContext from "../context/GlobalContext";
import Pin from "../components/Pin";
import AddPin from "../components/AddPin";
import Loader from "../components/Loader";
import SocialShare from "../components/SocialShare";

const MapPage = () => {
  const { pins, authUser, setAuthUser, isLoading } = useContext(GlobalContext);
  const [currentPinId, setCurrentPinId] = useState(null);
  const [newCoord, setNewCoord] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });

  useEffect(() => {
    if (authUser)
      toast.info("Tip: double click on the map to add a new pin.", {
        position: "top-right",
        autoClose: false,
      });
  }, [authUser]);

  if (!authUser) return <Redirect to="/" />;

  // create a new marker & popup at clicked location
  const handleMapDblClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewCoord({ lat, long });
  };

  const handleLogout = () => {
    localStorage.removeItem("pin-my-map-user");
    setAuthUser(null);
  };

  return (
    <Container>
      <Helmet>
        <title>
          {authUser && `Pin My Map | ${authUser.user.username}'s map`}
        </title>
        <meta
          name="description"
          content="Pin My Map user's map page. Add, edit, update and delete pins on map."
        />
      </Helmet>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle="mapbox://styles/liuhe2020/cktu2h4q70wil17m6umh33a9i"
        onDblClick={handleMapDblClick}
      >
        {pins &&
          pins.map((pin) => (
            <Pin
              key={pin.id}
              pin={pin}
              viewport={viewport}
              setViewport={setViewport}
              currentPinId={currentPinId}
              setCurrentPinId={setCurrentPinId}
            />
          ))}
        {newCoord && (
          <Popup
            latitude={newCoord.lat}
            longitude={newCoord.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewCoord(null)}
          >
            <AddPin newCoord={newCoord} setNewCoord={setNewCoord} />
          </Popup>
        )}
        {isLoading && <Loader />}
      </ReactMapGL>
      <ButtonWrapper>
        <Button
          variant="contained"
          size="small"
          color="warning"
          onClick={handleLogout}
        >
          <ExitToApp style={{ fontSize: "20px", marginRight: "3px" }} />
          Log out
        </Button>
        <SocialShare id={authUser.user.id} />
      </ButtonWrapper>
    </Container>
  );
};

export default MapPage;

const Container = styled.div`
  position: relative;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  display: flex;
  top: 10px;
  left: 10px;

  button {
    margin: 5px;
  }
`;
