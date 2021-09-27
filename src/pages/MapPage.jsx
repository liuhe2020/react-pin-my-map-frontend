import styled from "styled-components";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { ToastContainer, toast } from "react-toastify";
import useFetch from "../utilities/useFetch";
import Pin from "../components/Pin";
import AddPin from "../components/AddPin";

const MapPage = () => {
  const [pins, setPins] = useState(null);
  const [currentPinId, setCurrentPinId] = useState(null);
  const [newCoord, setNewCoord] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });

  const handleMapDblClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewCoord({ lat, long });
  };

  useEffect(() => {
    const getPins = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/pins`);
      if (!res.ok) {
        toast("Network error. Please try again later.");
      } else {
        const pins = await res.json();
        setPins(pins);
      }
    };
    getPins();
  }, []);

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
          <AddPin
            newCoord={newCoord}
            setNewCoord={setNewCoord}
            setPins={setPins}
          />
        </Popup>
      )}
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ReactMapGL>
  );
};

export default MapPage;
