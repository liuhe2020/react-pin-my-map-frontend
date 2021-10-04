import { useState, useContext } from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";

import Loader from "../components/Loader";
import GlobalContext from "../context/GlobalContext";

const Login = () => {
  const { isLoading, setIsLoading } = useContext(GlobalContext);
  const [hasEmail, setHasEmail] = useState(true);
  const [hasPassword, setHasPassword] = useState(true);
  const [loginCreds, setLoginCreds] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    setHasEmail(true);
    setHasPassword(true);
    const { name, value } = e.target;
    setLoginCreds({ ...loginCreds, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate form - no empty fields
    if (loginCreds.identifier === "") {
      setHasEmail(false);
      return;
    }

    if (loginCreds.password === "") {
      setHasPassword(false);
      return;
    }

    setIsLoading(true);

    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginCreds),
    });

    if (res.status !== 200) {
      toast("Failed to log in, please try again.");
      setIsLoading(false);
    } else {
      const data = await res.json();
      localStorage.setItem("pin-my-map-user", JSON.stringify(data));
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Form>
        <TextField
          id="outlined-basic"
          label="Email address"
          name="identifier"
          value={loginCreds.identifier}
          variant="outlined"
          color="warning"
          onChange={handleChange}
          error={!hasEmail && true}
          helperText={!hasEmail && "Email address is required."}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          name="password"
          value={loginCreds.password}
          variant="outlined"
          color="warning"
          onChange={handleChange}
          error={!hasPassword && true}
          helperText={!hasPassword && "Password is required."}
        />
        <Button variant="contained" color="warning" onClick={handleSubmit}>
          Log in
        </Button>
      </Form>
      {isLoading && <Loader />}
    </Container>
  );
};

export default Login;

const Container = styled.div``;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  .MuiTextField-root {
    margin: 15px 0;
    width: 40ch;
  }
`;
