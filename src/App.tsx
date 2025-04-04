import { useEffect } from "react";
import { useSelector } from "react-redux";
import "./App.scss";
import Calendar from "./components/Calendar/Calendar";
import DeleteTaskModal from "./components/DeleteTaskModal/DeleteTaskModal";
import Header from "./components/Header/Header";
import TaskModal from "./components/TaskModal/TaskModal";
import { RootState } from "./store";

function App() {
  const { theme } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return (
    <div>
      <Header />
      <Calendar />
      <TaskModal />
      <DeleteTaskModal />
    </div>
  );
}

export default App;
