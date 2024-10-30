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
                Báo cáo:{" "}
                <a
                  href="https://docs.google.com/document/d/1cDzQpw65fTBniN83w0vqlp14fk4sn1acfIHfKK6A_J0/edit?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                >
                  File báo cáo
                </a>
              </div>
              <div className="info-detail">
                Github:{" "}
                <a
                  href="https://github.com/vuhaianh210/IOT-smart-home"
                  target="_blank"
                  rel="noreferrer"
                >
                  Link github
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
