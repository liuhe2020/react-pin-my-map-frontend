import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import GlobalStyles from "./globalStyles";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import MapPage from "./pages/MapPage";

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/map">
            <MapPage />
          </Route>
          <Route path="/"></Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
