import ReactDom from "react-dom";
import FsLightbox from "fslightbox-react";

const Lightbox = ({ lightboxController, photoUrls }) => {
  return ReactDom.createPortal(
    <FsLightbox
      toggler={lightboxController.toggler}
      sources={photoUrls.map((url) => url.original)}
      slide={lightboxController.slide}
    />,
    document.getElementById("portal-root")
  );
};

export default Lightbox;
