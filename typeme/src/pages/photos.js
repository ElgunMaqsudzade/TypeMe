import React from "react";
import { useParams, useQuery } from "react-router-dom";
import Camera from "../images/camera_big.png";
import Shadow from "../images/shadow.png";
function Photos() {
  const { username } = useParams();

  const data = [
    {
      id: "1",
      name: "album1",
      images: [
        { id: 1, photo: "http://jrcomerun-001-site1.ftempurl.com/images/cutedProfile/default.png" },
        { id: 2, photo: "http://jrcomerun-001-site1.ftempurl.com/images/cutedProfile/default.png" },
      ],
    },
    {
      id: "2",
      name: "album2",
      images: [
        { id: 1, photo: "http://jrcomerun-001-site1.ftempurl.com/images/cutedProfile/default.png" },
        { id: 2, photo: "http://jrcomerun-001-site1.ftempurl.com/images/cutedProfile/default.png" },
      ],
    },
    {
      id: "3",
      name: "album3",
      images: [],
    },
    {
      id: "4",
      name: "album3",
      images: [],
    },
  ];

  return (
    <>
      <div className="images">
        <div className="albums-box mCard">
          <div className="topside">
            <div className="name-box">
              My albums <span className="count">{data.length}</span>
            </div>
            <div className="buttons">
              <button className="minor-btn-slimer">New album</button>
              <button className="main-btn-slimer">Add photos</button>
            </div>
          </div>
          <div className="body-content">
            {data.map((album) => {
              const { id, name, images } = album;
              return (
                <div
                  key={id}
                  style={{
                    backgroundImage: `url(${images.length === 0 ? Camera : images[0].photo})`,
                  }}
                  className={`album ${images.length === 0 ? "no-cover" : ""}`}
                >
                  <div
                    style={{
                      backgroundImage: `url(${Shadow})`,
                    }}
                    className="albom-title-wrap"
                  >
                    <div className="album-name">{name}</div>
                    <div className="image-count">{images.length}</div>
                  </div>
                  <div className="album-edit"></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="photos-box mCard">
          <div className="topside">
            <div className="name-box">
              My photos <span className="count">{3}</span>
            </div>
          </div>
          <div className="body-content">
            {data.map((album) => {
              return album.images.map((image) => {
                const { id, photo } = image;
                return (
                  <div key={id} className="image">
                    {photo}
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Photos;
