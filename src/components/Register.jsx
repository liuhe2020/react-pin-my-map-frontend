import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Register = () => {
  return (
    <Container>
      <Form>
        <TextField
          id="outlined-basic"
          label="Username"
          variant="outlined"
          color="warning"
        />
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          color="warning"
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          color="warning"
        />
        <TextField
          id="outlined-basic"
          label="Confirm Password"
          variant="outlined"
          color="warning"
        />
        <Button variant="contained" color="warning">
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default Register;

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
