import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "@mui/material/Button";

const Header = () => {
  return (
    <Container>
      <img src="./img/mappins_logo.png" alt="mappins_logo"></img>
      <Wrapper>
        <Link to="/login">
          <Button variant="contained" color="warning">
            Register
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="contained" color="warning">
            Login
          </Button>
        </Link>
      </Wrapper>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;

  img {
    width: 80px;
  }
`;

const Wrapper = styled.div`
  button {
    text-transform: none;
    margin-left: 10px;
  }
`;
