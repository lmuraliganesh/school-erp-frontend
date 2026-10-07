import {Link} from "react-router-dom";
import "./Navbar.css";

function Navbar(){
    return (
     <div className="dash-nav">
        <div className="dash-brand">School Erp</div>
        <div className="dash-links">
            <Link to="/dashboard" className="dash-link">Dashboard</Link>
            <Link to="/classes" className="dash-link">Classes</Link>
            <Link to="/subjects" className="dash-link">Subjects</Link>
            <Link to="/timetable" className="dash-link">Timetable</Link>
            <Link to="/announcements" className="dash-link">Announcements</Link>
            <Link to="/attendance" className="dash-link">Attendance</Link>
      </div>
    </div>
  );
}

export default Navbar;