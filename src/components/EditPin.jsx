import { useState, useEffect } from "react";
import styled from "styled-components";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Room } from "@mui/icons-material";

const EditPin = ({ pin }) => {
  const [selectedDate, setSelectedDate] = useState(pin.date);
  const [images, setImages] = useState(pin.photos);
  const [imageUrls, setImageUrls] = useState(null);
  const [deletedImages, setDeletedImage] = useState(null);
  const [addedImages, setAddedImage] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [values, setValues] = useState({
    location: pin.location,
    description: pin.description,
    latitude: pin.latitude,
    longitude: pin.longitude,
  });

  const handleDateChange = (newDate) => setSelectedDate(newDate);

  const handleImageChange = (e) => {
    const selectedImages = Object.values(e.target.files);
    setImages(selectedImages);
    //   Object.values(e.target.files).forEach((file) => console.log(file.name));
  };

  // useEffect(() => {
  //   if (images) {
  //     const urls = images.map((image) => URL.createObjectURL(image));
  //     setImageUrls(urls);
  //   }
  // }, [images]);

  const handleChange = (e) => {
    setIsEmpty(false);
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate location field
    const hasLocation = values.location === "";

    if (hasLocation) {
      setIsEmpty(true);
    } else {
      const submitValues = { ...values, date: selectedDate };

      const res = await fetch(`http://localhost:1337/pins/${pin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitValues),
      });

      if (!res.ok) {
        throw Error("Failed to upload data, please try again later.");
      } else {
        const data = await res.json();

        const response = await fetch(`http://localhost:1337/upload/files/3`, {
          method: "DELETE",
        });

        // if (images) {
        //   const formData = new FormData();
        //   formData.append("ref", "pins");
        //   formData.append("refId", data.id);
        //   formData.append("field", "photos");
        //   images.forEach((image) =>
        //     formData.append(`files`, image, image.name)
        //   );

        //   const res = await fetch("http://localhost:1337/upload", {
        //     method: "POST",
        //     body: formData,
        //   });

        //   if (res.ok) {
        //     console.log("images uploaded");
        //   }
        // }
      }
    }
  };

  return (
    <Container>
      <Title>
        <Room color="warning" fontSize="large" />
        <h1>Edit Pin</h1>
      </Title>
      <Form onSubmit={handleSubmit}>
        <TextField
          id="outlined-basic"
          variant="outlined"
          error={isEmpty && true}
          helperText={isEmpty && "This field cannot be empty."}
          label="Location"
          name="location"
          value={values.location}
          onChange={handleChange}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            inputFormat="dd/MM/yyyy"
            label="Date"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={4}
          label="Description"
          name="description"
          value={values.description}
          onChange={handleChange}
        />
        <PhotosWrapper>
          {/* {images && (
            <PhotosGrid>
              {images.map((photo) => (
                <Photo src={photo.formats.thumbnail.url} />
              ))}
            </PhotosGrid>
          )} */}

          <label htmlFor="contained-button-file">
            <Input
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <Button
              variant="contained"
              component="span"
              size="small"
              color="warning"
            >
              Add Photos
            </Button>
          </label>
        </PhotosWrapper>
        <Button variant="contained" color="primary" type="submit">
          Confirm
        </Button>
      </Form>
    </Container>
  );
};

export default EditPin;

const Container = styled.div``;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  color: #ed6c02;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;

  .MuiTextField-root {
    width: 95%;
    margin: 12px;
  }

  .MuiButton-root {
    margin: 12px;
  }
`;

const PhotosWrapper = styled.div`
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  width: 95%;
  margin: 12px 0;
  padding: 12px 0;
  display: flex;
  flex-direction: column;

  :hover {
    border-color: #212121;
  }

  label {
    margin: auto;
  }
`;

const PhotosGrid = styled.div`
  padding: 6px 12px 12px 12px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 4px;
`;

const Input = styled("input")({
  display: "none",
});

const Photo = styled.img`
  width: 100%;
  height: 47.69px;
  object-fit: cover;
`;
