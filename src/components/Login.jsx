import { useState } from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Login = () => {
  const [isEmpty, setIsEmpty] = useState(false);
  const [loginCreds, setLoginCreds] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    setIsEmpty(false);
    const { name, value } = e.target;
    setLoginCreds({ ...loginCreds, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate form - no empty fields
    if (loginCreds.identifier === "" || loginCreds.password === "") {
      setIsEmpty(true);
      return;
    }

    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginCreds),
      // credentials: "include",
    });

    const data = await res.json();
    console.log(data);
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
          error={isEmpty && true}
          helperText={isEmpty && "Email address is required."}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          name="password"
          value={loginCreds.password}
          variant="outlined"
          color="warning"
          onChange={handleChange}
          error={isEmpty && true}
          helperText={isEmpty && "Password is required."}
        />
        <Button variant="contained" color="warning" onClick={handleSubmit}>
          Log in
        </Button>
      </Form>
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
