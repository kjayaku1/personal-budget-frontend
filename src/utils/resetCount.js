import { useContext } from "react";
import { GlobalContext, actions } from "../context";
const ResetCount = () => {
    const { dispatch } = useContext(GlobalContext);
    const storeHandler = (type, payload) => dispatch({ type, payload });
    storeHandler(actions.TIMER_COUNT, 60);
    // localStorage.setItem("countdownSeconds", 60);
}

export default ResetCount;