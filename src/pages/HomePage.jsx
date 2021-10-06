import { Redirect } from "react-router-dom";
import { useState, useContext } from "react";
import styled from "styled-components";

import Login from "../components/Login";
import Register from "../components/Register";
import Loader from "../components/Loader";
import GlobalContext from "../context/GlobalContext";

const HomePage = () => {
  const { isLoading, authUser } = useContext(GlobalContext);
  const [isRegister, setIsRegister] = useState(false);

  if (authUser) return <Redirect to="/map" />;

  return (
    <>
      {isRegister ? (
        <Register setIsRegister={setIsRegister} />
      ) : (
        <Login setIsRegister={setIsRegister} />
      )}

      {isLoading && <Loader />}
    </>
  );
};

export default HomePage;
