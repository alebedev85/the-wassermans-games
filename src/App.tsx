import { useEffect } from "react";
import "./App.scss";
import DeleteTaskModal from "./components/DeleteTaskModal/DeleteTaskModal";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import TaskModal from "./components/TaskModal/TaskModal";
import "./firebase";
import { auth } from "./firebase";
import Calendar from "./pages/Calendar/Calendar";
import { useAppDispatch, useAppSelector } from "./store";
import { clearUser, setUser } from "./store/authSlice";

function App() {
  const { theme } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          setUser({
            email: user.email,
            token: user.refreshToken,
            id: user.uid,
          })
        );
      } else {
        dispatch(clearUser());
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
