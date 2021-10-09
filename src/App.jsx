import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import GlobalStyles from "./globalStyles";
import { GlobalProvider } from "./context/GlobalContext";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import UserMapPage from "./pages/UserMapPage";

function App() {
  return (
    <GlobalProvider>
      <GlobalStyles />
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
    </GlobalProvider>
  );
}

export default App;
