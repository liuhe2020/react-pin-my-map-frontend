import styled from "styled-components";
import { useState, useContext } from "react";
import ReactMapGL, { Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import Pin from "../components/Pin";
import AddPin from "../components/AddPin";
import Loader from "../components/Loader";
import GlobalContext from "../context/GlobalContext";

const MapPage = () => {
  const { pins, isLoading } = useContext(GlobalContext);

  const [currentPinId, setCurrentPinId] = useState(null);
  const [newCoord, setNewCoord] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });

  // create a new marker & popup at clicked location
  const handleMapDblClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewCoord({ lat, long });
  };

  return (
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
          anchor="left"
        >
          <AddPin newCoord={newCoord} setNewCoord={setNewCoord} />
        </Popup>
      )}
      {isLoading && <Loader />}
    </ReactMapGL>
  );
};

export default MapPage;
