import { useState, useEffect } from "react";
import Navbar from "./Navbar";

interface ClassItem {
  id: number;
  name: string;
  section: string;
}

interface StudentEntry {
  id: number;
  user_id: number;
  class_id: number;
  name: string;
  roll_number: string;
}

interface AttendancePageProps {
  token: string;
}

function AttendancePage({ token }: AttendancePageProps) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<StudentEntry[]>([]);
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [statusMap, setStatusMap] = useState<Record<number, string>>({});
  const filteredStudents = students.filter((s) => s.class_id === Number(classId));
  const decoded = decodeToken(token);
  const isAdmin = decoded?.role === "admin";
  const isTeacher = decoded?.role === "teacher";
  const myUserId = decoded?.user_id;
  const [myAttendance, setMyAttendance] = useState<any[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const response = await fetch("http://localhost:8080/api/classes", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (response.ok) {
        setClasses(await response.json());
      }
    };

    const fetchStudents = async () => {
      const response = await fetch("http://localhost:8080/api/students", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (response.ok) {
        setStudents(await response.json());
      }
    };

    fetchClasses();
    fetchStudents();
  }, [token]);

    useEffect(() => {
  if (isAdmin || isTeacher || !myUserId) return;

  const fetchMyAttendance = async () => {
    const response = await fetch(`http://localhost:8080/api/students/${myUserId}/attendance`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (response.ok) {
      setMyAttendance(await response.json());
    }
  };

  fetchMyAttendance();
}, [token, myUserId, isAdmin, isTeacher]);

  const toggleStatus = (userId : number, status : string) =>{
    setStatusMap({...statusMap, [userId]: status });
  }

  const handleSubmitAttendance = async () =>{
    const entries = filteredStudents.map((s) =>({
        student_id : s.user_id,
        status : statusMap[s.user_id] || "absent",
    }));
    try {
    const response = await fetch ("http://localhost:8080/api/attendance",{
        method : "POST",
        headers :{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },

        body : JSON.stringify({
            class_id : Number(classId),
            date : date,
            students : entries,
        }),
    });

    if (!response.ok){
        console.error("Failed to submit attendance");
        return;
    }

    alert ("Attendance submitted");
}catch (err){
    console.error("Error in submitting the attendance",err);

}
  };  
  
 function decodeToken(token : string){
    try{
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    }catch{
       return null;
    }
 } 
 return (
  <div style={{ padding: "2rem" }}>
    <Navbar />
    <h1>Attendance</h1>

   {(isAdmin || isTeacher) && (
    <div>
    <select value={classId} onChange={(e) => setClassId(e.target.value)}>
      <option value="">Select class</option>
      {classes.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name} — {c.section}
        </option>
      ))}
    </select>

    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

<ul>
  {filteredStudents.map((s) => (
    <li key={s.id}>
      {s.name} — Roll {s.roll_number}
      {" "}
      <button onClick={() => toggleStatus(s.user_id, "present")}>Present</button>
      <button onClick={() => toggleStatus(s.user_id, "absent")}>Absent</button>
      {" "}
      {statusMap[s.user_id] && <strong>{statusMap[s.user_id]}</strong>}
    </li>
  ))}
</ul>

<button onClick={handleSubmitAttendance}>Submit Attendance</button>
  </div>
)}
{!isAdmin && !isTeacher && (
  <div>
    <h3>My attendance</h3>
    <ul>
      {myAttendance.map((a) => (
        <li key={a.id}>
          {a.date} — {a.status}
        </li>
      ))}
    </ul>
  </div>
)}
</div>
);
}
export default AttendancePage;