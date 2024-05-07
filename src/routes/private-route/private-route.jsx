import React, { useState, useEffect, useContext } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { GlobalContext } from "../../context";
import Logout from "../../utils/logout";
import RefreshTokenModal from "../../utils/RefreshTokenModal";

// handle the private routes

const menuList = [
  {
    text: "Dashboard",
    to: "/dashboard",
    icon: <i class="fa fa-codiepie fa-lg me-2" />,
  },
  {
    text: "Expenses",
    to: "/expenses",
    icon: <i class="fa fa-dollar fa-sm me-2" />,
  },
  {
    text: "Monthly Report",
    to: "/month-expenses",
    icon: <i class="fa fa-calendar fa-sm me-2" />,
  },
];

function PrivateRoute(Component, PostLoginLayout) {
  const location = useLocation();
  const {
    state: { isLoggedIn },
  } = useContext(GlobalContext);

  const token = !!localStorage.getItem("authToken");

  const [modalOpen, setModalOpen] = useState(false);
  const [seconds, setSeconds] = useState(
    localStorage.getItem("countdownSeconds") || 12
  ); // Default to 2 minutes
  const [countRed, setCountRed] = useState(false);

  useEffect(() => {
    let intervalId;

    const storedSeconds = localStorage.getItem("countdownSeconds") || 12;
    setSeconds(parseInt(storedSeconds)); // Parse the stored value as an integer

    if (parseInt(storedSeconds) > 0 && (isLoggedIn || token)) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = Math.max(prevSeconds - 1, 0); // Ensure countdown doesn't go below 0
          localStorage.setItem("countdownSeconds", newSeconds); // Update countdown value in localStorage
          return newSeconds;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isLoggedIn, token, modalOpen]);

  useEffect(() => {
    if (seconds === 30) {
      toast.error("Token expires in 30 seconds", { id: "token" });
    }

    if (seconds <= 30) {
      setCountRed(true);
    }

    if (seconds <= 0) {
      // toast.error("Token expired. Login now!", { id: "tokenExpired" });
      setModalOpen(true);
    }
  }, [seconds]);

  // Format the seconds to display as mm:ss
  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(
    2,
    "0"
  )}:${String(seconds % 60).padStart(2, "0")}`;

  return isLoggedIn || token ? (
    <PostLoginLayout>
      <div className="menu d-flex justify-content-between" role="navigation">
        <ul>
          {menuList?.map((item) => (
            <li>
              <Link
                to={item?.to}
                className={`${
                  location.pathname === item?.to ? "active" : ""
                } mt-2 mb-1 mx-2`}
              >
                {item?.icon}
                {item?.text}
              </Link>
            </li>
          ))}
        </ul>
        <ul>
          <li
            className={`count-down ${
              countRed ? "count-text-red" : ""
            } mt-2 mb-1 mx-2`}
          >
            {formattedTime}
          </li>
          <li>
            <Link className={`mt-2 mb-1`} onClick={() => Logout()}>
              Logout <i class="fa fa-arrow-right fa-lg ms-2" />
            </Link>
          </li>
        </ul>
      </div>
      <Component />
      <div class="copyright">
        <p>&#169; All rights reserved | Kalai Arasi Jayakumar</p>
      </div>
      <RefreshTokenModal isOpen={modalOpen} isClose={setModalOpen} />
    </PostLoginLayout>
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateRoute;
