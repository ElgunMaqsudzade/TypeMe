import React from "react";
import { useQuery } from "./customHooks/useQuery";
import { useLocation, useHistory } from "react-router-dom";
import { Icon16Cancel } from "@vkontakte/icons";

function Imagemodal({ images }) {
  const location = useLocation();
  const query = useQuery();
  const history = useHistory();
  const ExitImage = () => {
    query.delete("image");
    let [key] = query.keys();
    if (key) {
      history.push(`${location.pathname}?${query.toString()}`);
    } else {
      history.push(location.pathname);
    }
  };
  return (
    <>
      {query.get("image") &&
        images.map((image) => {
          if (image.id === Number(query.get("image"))) {
            return (
              <div
                key={"modal-images-" + image.id}
                className="modal-box"
                onClick={() => ExitImage()}
              >
                <div className="singleimage" onClick={(e) => e.stopPropagation()}>
                  <Icon16Cancel className="exit-icon" onClick={() => ExitImage()} />
                  <div className="image-holder">
                    <img src={image.photo} alt="" />
                  </div>
                </div>
              </div>
            );
          }
        })}
    </>
  );
}

export default Imagemodal;
