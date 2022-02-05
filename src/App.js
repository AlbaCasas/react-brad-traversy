import { useEffect, useState } from "react";
import AddTask from "./components/AddTask";
import Header from "./components/Header";
import Tasks from "./components/Tasks";

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchAndSetTasks = async () => {
      const data = await fetchTasks();
      setTasks(data);
    };

    fetchAndSetTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5001/task");
    const data = await res.json();
    return data;
  };

  //Add Task
  const addTask = async (text, day, reminder) => {
    await fetch("http://localhost:5001/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, day, reminder }),
    });

    const data = await fetchTasks();
    setTasks(data);
  };

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5001/task/${id}`, { method: "DELETE" });
    const data = await fetchTasks();
    setTasks(data);
  };

  // toggle reminder
  const toggleReminder = async (id) => {
    const task = tasks.find((task) => task.id === id);
    await fetch(`http://localhost:5001/task/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...task, reminder: !task.reminder }),
    });
    const data = await fetchTasks();
    setTasks(data);
  };

  return (
    <div className="container">
      <Header
        title="Task Tracker"
        onAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />

      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
      ) : (
        "No tasks to Show"
      )}
    </div>
  );
}

export default App;
