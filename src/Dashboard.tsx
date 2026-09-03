import "./Dashboard.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface DashboardProps {
  adminName: string;
  users: User[];
}

function Dashboard({ adminName, users }: DashboardProps) {
  const studentCount = users.filter((u) => u.role === "student").length;
  const teacherCount = users.filter((u) => u.role === "teacher").length;

  return (
    <div className="dash">
      <div className="dash-nav">
        <div className="dash-brand">School ERP</div>
        <div className="dash-links">
          <span className="dash-link active">Dashboard</span>
          <span className="dash-link">Classes</span>
          <span className="dash-link">Timetable</span>
          <span className="dash-link">Announcements</span>
        </div>
        <div className="dash-admin">{adminName}</div>
      </div>

      <div className="dash-body">
        <p className="dash-greeting">Hello, {adminName}</p>

        <div className="dash-stats">
          <div className="stat-card">
            <div className="stat-number">{studentCount}</div>
            <div className="stat-label">Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{teacherCount}</div>
            <div className="stat-label">Teachers</div>
          </div>
          <div className="stat-card stat-card-muted">
            <div className="stat-number">—</div>
            <div className="stat-label">Classes · soon</div>
          </div>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-title">Announcements</div>
          <div className="dash-panel-item">
            <div className="dash-panel-item-title">Coming in Sprint 3</div>
            <div className="dash-panel-item-sub">
              Announcements will appear here once built
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
