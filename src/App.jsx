import { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      return JSON.parse(savedTasks);
    }

    return [];
  });

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    duration: "",
    difficulty: "srednje",
    reminder: "30",
    notes: "",
  });

  function saveTasks(newTasks) {
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title || !formData.date || !formData.startTime) {
      alert("Moraš uneti naziv zadatka, datum i vreme početka.");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: formData.title,
      date: formData.date,
      startTime: formData.startTime,
      duration: formData.duration,
      difficulty: formData.difficulty,
      reminder: formData.reminder,
      notes: formData.notes,
      done: false,
    };

    const updatedTasks = [...tasks, newTask];

    updatedTasks.sort((a, b) => {
      const firstDate = new Date(`${a.date}T${a.startTime}`);
      const secondDate = new Date(`${b.date}T${b.startTime}`);
      return firstDate - secondDate;
    });

    saveTasks(updatedTasks);

    setFormData({
      title: "",
      date: "",
      startTime: "",
      duration: "",
      difficulty: "srednje",
      reminder: "30",
      notes: "",
    });
  }

  function deleteTask(id) {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    saveTasks(updatedTasks);
  }

  function toggleDone(id) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          done: !task.done,
        };
      }

      return task;
    });

    saveTasks(updatedTasks);
  }

  function getDateObject(dateString) {
    const [year, month, day] = dateString.split("-");

    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");

    return `${day}.${month}.${year}.`;
  }

  function formatWeekday(dateString) {
    const date = getDateObject(dateString);

    return date.toLocaleDateString("sr-RS", {
      weekday: "long",
    });
  }

  function formatTime(timeString) {
    return `${timeString} časova`;
  }

  function formatDuration(duration) {
    if (!duration) {
      return "nije određeno";
    }

    const minutes = Number(duration);

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      if (hours === 1) {
        return "1 sat";
      }

      return `${hours} sata`;
    }

    return `${hours} h ${remainingMinutes} min`;
  }

  function formatReminder(reminder) {
    if (reminder === "0") {
      return "bez podsetnika";
    }

    if (reminder === "60") {
      return "1 sat pre";
    }

    if (reminder === "1440") {
      return "1 dan pre";
    }

    return `${reminder} min pre`;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Smart planner</p>
          <h1>Task Calendar Assistant</h1>
          <p className="subtitle">
            Organizuj zadatke po datumu, vremenu, težini i procenjenom trajanju.
          </p>
        </div>
      </header>

      <main className="layout">
        <section className="card form-card">
          <h2>Dodaj novi zadatak</h2>

          <form onSubmit={handleSubmit}>
            <label>
              Naziv zadatka
              <input
                type="text"
                name="title"
                placeholder="npr. Učenje React-a"
                value={formData.title}
                onChange={handleChange}
              />
            </label>

            <div className="two-columns">
              <label>
                Datum
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </label>

              <label>
                Vreme početka
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="two-columns">
              <label>
                Procena trajanja
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                >
                  <option value="">Nije određeno</option>
                  <option value="15">15 minuta</option>
                  <option value="30">30 minuta</option>
                  <option value="60">1 sat</option>
                  <option value="90">1.5 sat</option>
                  <option value="120">2 sata</option>
                  <option value="180">3 sata</option>
                  <option value="240">4 sata</option>
                </select>
              </label>

              <label>
                Težina
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  <option value="lako">Lako</option>
                  <option value="srednje">Srednje</option>
                  <option value="tesko">Teško</option>
                </select>
              </label>
            </div>

            <label>
              Podsetnik
              <select
                name="reminder"
                value={formData.reminder}
                onChange={handleChange}
              >
                <option value="0">Bez podsetnika</option>
                <option value="10">10 minuta pre</option>
                <option value="30">30 minuta pre</option>
                <option value="60">1 sat pre</option>
                <option value="1440">1 dan pre</option>
              </select>
            </label>

            <label>
              Beleške
              <textarea
                name="notes"
                placeholder="npr. Preći osnove komponenti i state-a"
                value={formData.notes}
                onChange={handleChange}
              />
            </label>

            <button type="submit">Dodaj zadatak</button>
          </form>
        </section>

        <section className="card tasks-card">
          <div className="tasks-header">
            <h2>Moji zadaci</h2>
            <span>{tasks.length} ukupno</span>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>Još nema zadataka.</p>
              <p>Dodaj prvi zadatak pomoću forme sa leve strane.</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <article
                  key={task.id}
                  className={`task-item ${task.done ? "done" : ""}`}
                >
                  <div className="task-main">
                    <div>
                      <p className="task-date">
                        {formatWeekday(task.date)}, {formatDate(task.date)}
                      </p>
                      <h3>{task.title}</h3>
                    </div>

                    <span className={`difficulty ${task.difficulty}`}>
                      {task.difficulty}
                    </span>
                  </div>

                  <div className="task-details">
                    <p>
                      <strong>Početak:</strong> {formatTime(task.startTime)}
                    </p>

                    <p>
                      <strong>Trajanje:</strong>{" "}
                      {formatDuration(task.duration)}
                    </p>

                    <p>
                      <strong>Podsetnik:</strong>{" "}
                      {formatReminder(task.reminder)}
                    </p>
                  </div>

                  {task.notes && <p className="task-notes">{task.notes}</p>}

                  <div className="task-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => toggleDone(task.id)}
                    >
                      {task.done ? "Vrati" : "Završeno"}
                    </button>

                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => deleteTask(task.id)}
                    >
                      Obriši
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;