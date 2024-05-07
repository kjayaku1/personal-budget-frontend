import { useContext, useEffect, useState } from "react";
import { GlobalContext, actions } from "../context";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// import ResetCount from "./resetCount";
import Logout from "./logout";
import httpClient from "../api/http-client";

function RefreshTokenModal({ isOpen, isClose }) {
  const { dispatch } = useContext(GlobalContext);
  const storeHandler = (type, payload) => dispatch({ type, payload });

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isOpen);
    // console.log('isOpen', isOpen);
  }, [isOpen]);

  const handleClose = () => {
    isClose(false);
    setShow(false);
    Logout();
  };

  const handleCallRefreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const refreshResponse = await httpClient.post("/refresh/token", {
        refreshToken,
      });
      const { access_token } = refreshResponse.data;
      localStorage.setItem("authToken", access_token);
      // ResetCount();
      storeHandler(actions.TIMER_COUNT, 60);
      // localStorage.setItem("countdownSeconds", 60);
      isClose(false);
      setShow(false);
    }
  };

  return (
    <>
      <Modal
        show={show}
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
            <p className="text-center">
              Token is expiring. Would you like to refresh it?
            </p>
            <div className="d-flex align-items-center justify-content-center p-3">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="me-3"
              >
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
