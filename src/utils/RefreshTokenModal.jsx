import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ResetCount from "./resetCount";
import Logout from "./logout";

function RefreshTokenModal({ isOpen, isClose }) {
  const handleClose = () => {
    isClose(false);
    Logout();
  };

  const handleCallRefreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const refreshResponse = await axios.post("/refresh/token", {
        refreshToken,
      });
      const { access_token } = refreshResponse.data;
      localStorage.setItem("authToken", access_token);
      ResetCount();
      isClose(false);
    }
  };

  return (
    <>
      <Modal
        show={isOpen}
        backdrop="static"
        keyboard={false}
        centered
        onHide={handleClose}
      >
        {/* <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <div className="p-2">
            <p className="text-center">Token is expiring. Would you like to refresh it?</p>
            <div className="d-flex align-items-center justify-content-center p-3">
              <Button variant="secondary" onClick={handleClose} className="me-3" >
                No
              </Button>
              <Button variant="primary" onClick={handleCallRefreshToken}>
                Yes
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default RefreshTokenModal;
