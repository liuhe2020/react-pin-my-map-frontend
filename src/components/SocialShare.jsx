import styled from "styled-components";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import { TextField, Button } from "@mui/material";
import { Share } from "@mui/icons-material";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TumblrShareButton,
  RedditShareButton,
  PinterestShareButton,
  FacebookIcon,
  PinterestIcon,
  RedditIcon,
  TumblrIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const SocialShare = ({ id }) => {
  const url = `${process.env.REACT_APP_URL}/maps/${id}`;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="basic-button"
        variant="contained"
        size="small"
        color="warning"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Share style={{ fontSize: "18px", marginRight: "3px" }} />
        Share
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Wrapper>
          <Top>
            <TextField
              id="outlined-read-only-input"
              label="Link Address"
              defaultValue={url}
              InputProps={{
                readOnly: true,
              }}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => navigator.clipboard.writeText(url)}
            >
              Copy
            </Button>
          </Top>
          <Bottom>
            <FacebookShareButton url={url}>
              <FacebookIcon size={32} borderRadius={10} />
            </FacebookShareButton>
            <TwitterShareButton url={url}>
              <TwitterIcon size={32} borderRadius={10} />
            </TwitterShareButton>
            <WhatsappShareButton url={url}>
              <WhatsappIcon size={32} borderRadius={10} />
            </WhatsappShareButton>
            <RedditShareButton url={url}>
              <RedditIcon size={32} borderRadius={10} />
            </RedditShareButton>
            <PinterestShareButton media="" url={url}>
              <PinterestIcon size={32} borderRadius={10} />
            </PinterestShareButton>
            <TumblrShareButton url={url}>
              <TumblrIcon size={32} borderRadius={10} />
            </TumblrShareButton>
          </Bottom>
        </Wrapper>
      </Menu>
    </>
  );
};

export default SocialShare;

const Wrapper = styled.div`
  width: 330px;
  padding: 20px;
`;

const Top = styled.div`
  display: flex;
  align-items: center;

  button {
    margin-left: 15px;
  }

  .MuiOutlinedInput-root {
    width: 250px;
  }
`;

const Bottom = styled.div`
  margin-top: 15px;

  button {
    margin: 0 5px;
  }
`;
