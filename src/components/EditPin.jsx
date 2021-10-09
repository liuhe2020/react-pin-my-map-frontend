import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Room, DeleteForever } from "@mui/icons-material";
import { toast } from "react-toastify";

import GlobalContext from "../context/GlobalContext";

const EditPin = ({ pin, setCurrentPinId, setIsEditing }) => {
  const [selectedDate, setSelectedDate] = useState(pin.date);
  const [images, setImages] = useState(pin.photos);
  const [addedImageUrls, setAddedImageUrls] = useState(null);
  const [deletedImages, setDeletedImages] = useState([]);
  const [addedImages, setAddedImages] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [values, setValues] = useState({
    location: pin.location,
    description: pin.description,
    latitude: pin.latitude,
    longitude: pin.longitude,
  });

  const { setIsLoading, authUser, getPins } = useContext(GlobalContext);

  const handleDateChange = (newDate) => setSelectedDate(newDate);

  const handleImageChange = (e) => {
    // convert Filelist object to array and update in images state
    const imageFiles = [...e.target.files];
    // check images size
    const bigImages = imageFiles.filter((file) => file.size > 1024 * 1000);

    if (bigImages.length > 0) {
      toast.warn("The maximum size for each image is 1MB.");
    } else {
      setAddedImages([...imageFiles]);
    }
  };

  const handleImageDelete = (e) => {
    const imageId = Number(e.target.closest("div").previousSibling.id);
    const newImages = images.filter((image) => image.id !== imageId);
    const newDeletedImage = images.filter((image) => image.id === imageId)[0];
    setImages(newImages);
    setDeletedImages([...deletedImages, newDeletedImage]);
  };

  useEffect(() => {
    if (addedImages.length > 0) {
      const urls = addedImages.map((image) => URL.createObjectURL(image));
      setAddedImageUrls(urls);
    }
  }, [addedImages]);

  const handleValueChange = (e) => {
    setIsEmpty(false);
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const amendValues = () => {
    const submitValues = { ...values, date: selectedDate };
    const res = fetch(`${process.env.REACT_APP_API_URL}/pins/${pin.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authUser.jwt}`,
      },
      body: JSON.stringify(submitValues),
    });
    return res;
  };

  const deleteImages = () => {
    if (deletedImages.length > 0) {
      const res = deletedImages.map((image) => {
        const singleRes = fetch(
          `${process.env.REACT_APP_API_URL}/upload/files/${image.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${authUser.jwt}` },
          }
        );
        return singleRes;
      });
      return res;
    } else {
      return [];
    }
  };

  const addImages = () => {
    if (addedImages.length > 0) {
      const formData = new FormData();
      formData.append("ref", "pins");
      formData.append("refId", pin.id);
      formData.append("field", "photos");
      addedImages.forEach((image) =>
        formData.append(`files`, image, image.name)
      );
      const res = fetch(`${process.env.REACT_APP_API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authUser.jwt}` },
        body: formData,
      });
      return [res];
    } else {
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate location field
    if (values.location === "") {
      setIsEmpty(true);
      return;
    }

    setIsLoading(true);

    const allResponses = await Promise.all([
      amendValues(),
      ...deleteImages(),
      ...addImages(),
    ]);
    const hasFailedResponse = allResponses.some((res) => res.status !== 200);

    if (hasFailedResponse) {
      toast.error(
        "Network error. Failed to update the pin, please try again later."
      );
    } else {
      getPins();
      setCurrentPinId(null);
      setIsEditing(false);
      toast.success(`${values.location} - Updated`);
    }

    setIsLoading(false);
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
          onChange={handleValueChange}
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
          onChange={handleValueChange}
        />
        <PhotosContainer>
          {images && (
            <PhotosGrid>
              {images.map((photo) => (
                <PhotoWrapper key={photo.id}>
                  <Photo id={photo.id} src={photo.formats.thumbnail.url} />
                  <div>
                    <DeleteForever
                      color="warning"
                      onClick={handleImageDelete}
                    />
                  </div>
                </PhotoWrapper>
              ))}
              {addedImageUrls &&
                addedImageUrls.map((url, index) => (
                  <Photo key={index} src={url} />
                ))}
            </PhotosGrid>
          )}
          <p>The maximum image size is 5MB.</p>
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
              {!addedImageUrls ? "Add Photos" : "Change Photos"}
            </Button>
          </label>
        </PhotosContainer>
        <Button variant="contained" color="primary" type="submit">
          Confirm
        </Button>
      </Form>
    </Container>
  );
};

export default EditPin;

const Container = styled.div`
  cursor: initial;
  width: 400px;
`;

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
  width: 100%;

  .MuiTextField-root {
    width: 95%;
    margin: 12px;
  }

  .MuiButton-root {
    margin: 12px;
  }
`;

const PhotosContainer = styled.div`
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

  p {
    text-align: center;
    color: #bdbdbd;
    font-size: 14px;
  }
`;

const PhotosGrid = styled.div`
  padding: 6px 12px 12px 12px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 4px;
`;

const PhotoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 47.69px;

  div {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.7);
    display: none;

    svg {
      cursor: pointer;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  :hover {
    div {
      display: block;
    }
  }
`;

const Photo = styled.img`
  width: 100%;
  height: 47.69px;
  object-fit: cover;
`;

const Input = styled("input")({
  display: "none",
});
