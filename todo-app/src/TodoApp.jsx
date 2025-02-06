import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./styles.css";  // Εισαγωγή του CSS

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);  // State για το Dark Mode

  // Φόρτωση των tasks από το Local Storage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) setTasks(savedTasks);
  }, []);

  // Αποθήκευση των tasks στο Local Storage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Αλλαγή του Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  };

  const toggleTask = (index) => {
    setTasks(
      tasks.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    const reorderedTasks = [...tasks];
    const [removed] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, removed);

    setTasks(reorderedTasks);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "incomplete") return !t.completed;
    return true;
  });

  return (
    <div className={darkMode ? "dark" : ""}>
      <h2>To-Do List</h2>
      <div>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Προσθέστε ένα task..."
        />
        <button onClick={addTask}>Προσθήκη</button>
      </div>

      <div>
        <button onClick={() => setFilter("all")}>Όλα</button>
        <button onClick={() => setFilter("completed")}>Ολοκληρωμένα</button>
        <button onClick={() => setFilter("incomplete")}>Μη Ολοκληρωμένα</button>
      </div>

      {/* Κουμπί για εναλλαγή Dark Mode */}
      <button onClick={toggleDarkMode} style={{ marginTop: "15px", backgroundColor: darkMode ? "#444" : "#2196f3" }}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps}>
              <AnimatePresence>
                {filteredTasks.map((t, index) => (
                  <Draggable key={index} draggableId={index.toString()} index={index}>
                    {(provided, snapshot) => (
                      <motion.li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={t.completed ? "completed" : ""}
                        style={{
                          ...provided.draggableProps.style,
                          ...snapshot.isDragging && { opacity: 0.5 },
                        }}
                      >
                        {t.text}
                        <div>
                          <button onClick={() => toggleTask(index)}>✔</button>
                          <button onClick={() => deleteTask(index)}>❌</button>
                        </div>
                      </motion.li>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default TodoApp;
