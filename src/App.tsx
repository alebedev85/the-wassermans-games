import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.scss";
import DeleteTaskModal from "./components/DeleteTaskModal/DeleteTaskModal";
import Header from "./components/Header/Header";
import TaskModal from "./components/TaskModal/TaskModal";
import "./firebase";
import { auth } from "./firebase";
import Calendar from "./pages/Calendar/Calendar";
import { RootState } from "./store";
import { loginSuccess, logout } from "./store/authSlice";
import Footer from "./components/Footer/Footer";

function App() {
  const { theme } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          loginSuccess({
            email: user.email,
            token: user.refreshToken,
            id: user.uid,
          })
        );
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return (
    <div>
      <Header />
      <Calendar />
      <TaskModal />
      <DeleteTaskModal />
      <Footer />
    </div>
  );
}

export default App;
