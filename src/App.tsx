import "./App.scss";
import Calendar from "./components/Calendar/Calendar";
import Header from "./components/Header/Header";
import TaskModal from "./components/TaskModal/TaskModal";

function App() {
  return (
    <div>
      <Header />
      <Calendar />
      <TaskModal />
    </div>
  );
}

export default App;
