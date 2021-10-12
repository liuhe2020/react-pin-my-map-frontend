import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import ReactMapGL, { Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

import UserPin from "../components/UserPin";
import Loader from "../components/Loader";
import GlobalContext from "../context/GlobalContext";

const UserMapPage = () => {
  const history = useHistory();
  const { id } = useParams();
  const { isLoading, setIsLoading } = useContext(GlobalContext);
  const [user, setUser] = useState(null);
  const [currentPinId, setCurrentPinId] = useState(null);
  const [newCoord, setNewCoord] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });

  const handleSignUp = () => {
    history.push("/");
  };

  useEffect(() => {
    const getPins = async () => {
      setIsLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`);
      if (res.status !== 200) {
        setIsLoading(false);
        history.push("/");
        toast.error("Network error. Please try again later.");
      } else {
        const user = await res.json();
        setUser(user);
        setIsLoading(false);
      }
    };
    getPins();
  }, [id, setIsLoading, history]);

  return (
    <Container>
      <Helmet>
        <title>{user && `Pin My Map | ${user.username}'s map`}</title>
        <meta
          name="description"
          content="Pin My Map - view personalised map with pinned places the user has been to."
        />
      </Helmet>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle="mapbox://styles/liuhe2020/cktu2h4q70wil17m6umh33a9i"
      >
        {user &&
          user.pins.map((pin) => (
            <UserPin
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
          ></Popup>
        )}
        {isLoading && <Loader />}
      </ReactMapGL>
      <Button
        variant="contained"
        size="small"
        color="warning"
        style={{ position: "absolute", top: "15px", left: "15px" }}
        onClick={handleSignUp}
      >
        Sign Up
      </Button>
    </Container>
  );
};

export default UserMapPage;

const Container = styled.div`
  position: relative;
`;
