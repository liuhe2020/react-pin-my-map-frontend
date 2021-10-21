import { Redirect } from 'react-router-dom';
import { useState, useContext } from 'react';
import styled from 'styled-components';

import Login from '../components/Login';
import SignUp from '../components/SignUp';
import Loader from '../components/Loader';
import GlobalContext from '../context/GlobalContext';

const HomePage = () => {
  const { isLoading, authUser } = useContext(GlobalContext);
  const [isSignUp, setIsSignUp] = useState(false);

  if (authUser) return <Redirect to='/map' />;

  return (
    <Container>
      <Main>
        <Logo src='/img/pin_logo_s.png' alt='pin_my_map_logo' />
        <TitleWrapper>
          <h1>Pin My Map</h1>
          <h2>Record and share places that you have been.</h2>
        </TitleWrapper>
        <FormWrapper>
          {isSignUp ? (
            <SignUp setIsSignUp={setIsSignUp} />
          ) : (
            <Login setIsSignUp={setIsSignUp} />
          )}
        </FormWrapper>
        {isLoading && <Loader />}
      </Main>
      <Footer>
        <p>&copy; 2021 Pin My Map</p>
      </Footer>
      <Background src='/img/background.jpg' alt='pin_my_map_background' />
    </Container>
  );
};

export default HomePage;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Main = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
`;

const Background = styled.img`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: opacity(0.25);
  z-index: -1;
`;

const Logo = styled.img`
  position: absolute;
  left: 30px;
  top: 25px;
  width: 40px;
`;

const TitleWrapper = styled.div`
  margin: 180px 5vw 0 5vw;
  width: 400px;

  @media (max-width: 768px) {
    width: 80%;
    margin: 100px 0 50px 0;
    text-align: center;
  }

  h1 {
    color: #ed6c02;
    font-weight: 700;
    font-size: 60px;

    @media (max-width: 500px) {
      font-size: 48px;
    }
  }

  h2 {
    color: #212121;
    font-weight: 600;
    font-size: 24px;
    margin: 10px 0 0 0;
  }
`;

const FormWrapper = styled.div`
  margin: 120px 5vw 0 5vw;

  @media (max-width: 768px) {
    margin: 0 0 0 0;
  }
`;

const Footer = styled.div`
  width: 100%;
  text-align: center;
  height: 60px;
  margin-top: 40px;
  color: #757575;
`;
