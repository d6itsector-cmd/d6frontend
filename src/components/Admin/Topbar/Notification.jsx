import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";

import "./Notification.css";
import api from "../../../services/api";

const Notification = () => {

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api
      .get("/admin/notifications", { params: { limit: 10 } })
      .then((res) => {
        setNotifications(res.data?.data || []);
        setUnreadCount(res.data?.unreadCount ?? 0);
      })
      .catch(() => {
        // Leave whatever was last successfully loaded.
      });
  }, []);

  return(

    <div className="notification">

      <div
        className="bell"
        onClick={()=>setOpen(!open)}
        role="button"
        tabIndex={0}
        aria-label="Notifications"
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen(!open); }}
      >

        <FaBell/>

        {unreadCount > 0 && (
          <span className="badge">
            {unreadCount}
          </span>
        )}

      </div>

      {open &&(

        <div className="notification-menu">

          <h4>Notifications</h4>

          {notifications.length === 0 && (
            <p className="notification-item">You're all caught up.</p>
          )}

          {notifications.map((n) => (

            <div
              key={n._id}
              className="notification-item"
            >
              <strong>{n.title}</strong>
              <p>{n.message}</p>
            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default Notification;
