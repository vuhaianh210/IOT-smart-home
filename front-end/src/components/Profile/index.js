import profileImage from "./anh.jpg";
import "./Profile.css";

function Profile() {
  return (
    <>
    <div className="profile-container">
      <div className="profile">
        <div className="image-container">
          <img
            src={profileImage}
            alt="image-profile"
            className="profile-image"
          />
        </div>
        <div>
          <div className="infomation">
            <div className="name">Vũ Hải Anh</div>
            <div className="info-detail">Mã sinh viên: B21DCCN165</div>
            <div className="info-detail">Email: vuhaianh210@gmail.com</div>
            <div className="info-detail">Số điện thoại: 0363-068-596</div>
            <div className="info-detail">
              Github:{" "}
              <a
                href="https://github.com/vuhaianh210"
                target="_blank"
                rel="noreferrer"
              >
                https://github.com/vuhaianh210/IOT-smart-home
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default Profile;
