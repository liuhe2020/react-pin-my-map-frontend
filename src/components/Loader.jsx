import { useContext } from "react";
import styled from "styled-components";
import SyncLoader from "react-spinners/SyncLoader";
import GlobalContext from "../context/GlobalContext";

const Loader = () => {
  const { isLoading } = useContext(GlobalContext);

  return (
    <LoaderOverlay>
      <SyncLoader color="#ed6c02" loading={isLoading} />
    </LoaderOverlay>
  );
};

export default Loader;

const LoaderOverlay = styled.div`
  position: absolute;
  z-index: 10;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(250, 250, 250, 0.7);
`;
