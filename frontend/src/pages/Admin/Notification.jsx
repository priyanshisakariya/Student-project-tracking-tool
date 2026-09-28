import { useState } from "react";
import "./Notification.css";

function Notification() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Project Submission",
      recipient: "All Students",
      category: "Project",
      priority: "High",
      date: "2026-07-25",
      status: "Sent",
    },
    {
      id: 2,
      title: "Mentor Meeting",
      recipient: "All Mentors",
      category: "Meeting",
      priority: "Medium",
      date: "2026-07-26",
      status: "Scheduled",
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    recipient: "",
    category: "",
    priority: "Medium",
    message: "",
    date: "",
    status: "Sent",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newNotification = {
      id: notifications.length + 1,
      title: form.title,
      recipient: form.recipient,
      category: form.category,
      priority: form.priority,
      date: form.date,
      status: form.status,
    };

    setNotifications([...notifications, newNotification]);

    setForm({
      title: "",
      recipient: "",
      category: "",
      priority: "Medium",
      message: "",
      date: "",
      status: "Sent",
    });
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((item) => item.id !== id));
  };

  return (
    <div className="notification-page">

      <h1>Notifications</h1>

      {/* Dashboard Cards */}

      <div className="notification-cards">

        <div className="notification-card">
          <h2>{notifications.length}</h2>
          <p>Total Notifications</p>
        </div>

        <div className="notification-card">
          <h2>{notifications.filter(n => n.status === "Sent").length}</h2>
          <p>Sent</p>
        </div>

        <div className="notification-card">
          <h2>{notifications.filter(n => n.status === "Scheduled").length}</h2>
          <p>Scheduled</p>
        </div>

      </div>

      {/* Form */}

      <div className="notification-form">

        <h2>Send Notification</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="title"
            placeholder="Notification Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <select
            name="recipient"
            value={form.recipient}
            onChange={handleChange}
            required
          >
            <option value="">Select Recipient</option>
            <option>All Students</option>
            <option>All Mentors</option>
            <option>Specific Student</option>
            <option>Specific Mentor</option>
          </select>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option>General</option>
            <option>Project</option>
            <option>Meeting</option>
            <option>Deadline</option>
            <option>Assignment</option>
          </select>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option>Sent</option>
            <option>Scheduled</option>
            <option>Draft</option>
          </select>

          <textarea
            name="message"
            rows="5"
            placeholder="Notification Message"
            value={form.message}
            onChange={handleChange}
          ></textarea>

          <button type="submit">
            Send Notification
          </button>

        </form>

      </div>

      {/* Search */}

      <div className="notification-search">

        <input
          type="text"
          placeholder="Search Notification..."
        />

      </div>

      {/* Table */}

      <div className="notification-table">

        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Recipient</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {notifications.map((item) => (

              <tr key={item.id}>

                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.recipient}</td>
                <td>{item.category}</td>
                <td>{item.priority}</td>
                <td>{item.date}</td>
                <td>{item.status}</td>

                <td>
                  <button>Edit</button>

                  <button
                    onClick={() => deleteNotification(item.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Notification;