import React, { useState, useEffect, useContext } from "react";
import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GlobalContext, actions } from "../../context";
import Logout from "../../utils/logout";
import RefreshTokenModal from "../../utils/RefreshTokenModal";

const menuList = [
  {
    text: "Dashboard",
    to: "/dashboard",
    icon: <i className="fa fa-codiepie fa-lg me-2" />,
  },
  {
    text: "Expenses",
    to: "/expenses",
    icon: <i className="fa fa-dollar fa-sm me-2" />,
  },
  {
    text: "Monthly Report",
    to: "/month-expenses",
    icon: <i className="fa fa-calendar fa-sm me-2" />,
  },
];

function PrivateRoute(Component, PostLoginLayout) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    state: { isLoggedIn, timerCountSeconds },
    dispatch,
  } = useContext(GlobalContext);
  const storeHandler = (type, payload) => dispatch({ type, payload });

  const token = !!localStorage.getItem("authToken");

  const [modalOpen, setModalOpen] = useState(false);
  const [seconds, setSeconds] = useState(timerCountSeconds || 60);
  const [countRed, setCountRed] = useState(false);

  useEffect(() => {
    let intervalId;

    if (timerCountSeconds > 0 && (isLoggedIn || token)) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = timerCountSeconds - 1;
          storeHandler(actions.TIMER_COUNT, newSeconds);
          return newSeconds;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, token, timerCountSeconds]);

  useEffect(() => {
    if (timerCountSeconds === 30) {
      toast.error("Token expires in 30 seconds", { id: "token" });
    }

    if (timerCountSeconds <= 30) {
      setCountRed(true);
    }

    if (timerCountSeconds <= 0) {
      setModalOpen(true);
    }
  }, [timerCountSeconds]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    if (modalOpen) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [modalOpen]);

  useEffect(() => {
    const handleLocationChange = () => {
      if (modalOpen) {
        setModalOpen(false);
        setCountRed(false);
      }
    };

    return () => {
      handleLocationChange();
    };
  }, [location, modalOpen]);

  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(
    2,
    "0"
  )}:${String(seconds % 60).padStart(2, "0")}`;

  return isLoggedIn || token ? (
    <>
      <PostLoginLayout>
        <div className="menu d-flex justify-content-between" role="navigation">
          <ul>
            {menuList?.map((item) => (
              <li key={item?.text}>
                <Link
                  to={item?.to}
                  className={`${
                    location.pathname === item?.to ? "active" : ""
                  } mt-2 mb-1 mx-2`}
                  onClick={(e) => {
                    navigate(item.to);
                    e.preventDefault();
                  }}
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
                Logout <i className="fa fa-arrow-right fa-lg ms-2" />
              </Link>
            </li>
          </ul>
        </div>
        <Component />
        <div className="copyright">
          <p>&#169; All rights reserved | Kalai Arasi Jayakumar</p>
        </div>
      </PostLoginLayout>
      {modalOpen && (
        <RefreshTokenModal isOpen={modalOpen} isClose={setModalOpen} />
      )}
    </>
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateRoute;
