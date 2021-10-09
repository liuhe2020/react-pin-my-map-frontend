import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { ThemeProvider } from "@mui/material";
import MuiTheme from "./MuiTheme";

import GlobalStyles from "./globalStyles";
import { GlobalProvider } from "./context/GlobalContext";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import UserMapPage from "./pages/UserMapPage";

function App() {
  return (
    <GlobalProvider>
      <GlobalStyles />
      <ThemeProvider theme={MuiTheme}>
        <Router>
          <Switch>
            <Route path="/map">
              <MapPage />
            </Route>
            <Route path="/maps/:id">
              <UserMapPage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
      <StyledToastContainer
        position="top-left"
        autoClose={4000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        transition={Slide}
      />
    </GlobalProvider>
  );
}

export default App;

const StyledToastContainer = styled(ToastContainer).attrs({
  className: "toast-container",
})`
  width: 280px;
`;
