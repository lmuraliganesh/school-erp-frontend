import { useState, useEffect } from "react";
import Navbar from "./Navbar";

interface ClassItem{
    id : number;
    name : string;
    section : string;
}

interface SubjectItem{
    id : number;
    name : string;
    code : string;
}
interface TimetableEntry {
       id : number;
       class_id : number;
       subject_id : number;
       day_of_week : string;
       start_time : string;
       end_time : string;
}

interface TimetablePageProps {
    token : string;
}

function decodeToken(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

function TimetablePage ({token}: TimetablePageProps){

    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [subjects, setSubjects] = useState<SubjectItem[]>([]);
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
    const [classId, setClassId] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [dayOfWeek, setDayOfWeek] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const decoded = decodeToken(token);
    const isAdmin = decoded?.role === "admin";
    

    const fetchTimetable = async() => {
    const response = await fetch("http://localhost:8080/api/timetables",{
        headers : {"Authorization": `Bearer ${token}`},
    });
    if (response.ok){
        setTimetable(await response.json());
    }
    };

useEffect (() =>{
    const fetchClasses = async () =>{
    const response = await fetch("http://localhost:8080/api/classes", {
        headers :{ "Authorization": `Bearer ${token}`},
    });
    if (response.ok){
        setClasses (await response.json());
    }
};

    const fetchSubjects = async() => {
    const response = await fetch("http://localhost:8080/api/subjects",{
        headers : {"Authorization": `Bearer ${token}`},
    });
    if (response.ok){
        setSubjects(await response.json());
    }
};
  
fetchClasses();
fetchSubjects();
fetchTimetable();
}, [token]);

const handleCreateEntry = async() => {
    try {
        const response = await fetch("http://localhost:8080/api/timetables",{
            method : "POST",
            headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body : JSON.stringify({
        class_id : Number(classId),
        subject_id : Number(subjectId),
        day_of_week: dayOfWeek,
        start_time : startTime,
        end_time : endTime,
      }),

    });
    
    if (!response.ok){
        console.error("Failed to create timetable entry");
        return;
    }
    fetchTimetable();
    setDayOfWeek("");
    setStartTime("");
    setEndTime("");
    } catch (err){
        console.error("Error creating timetable entry", err);
    }
  };

  const getClassName = (id: number) => {
  const found = classes.find((c) => c.id === id);
  return found ? `${found.name} — ${found.section}` : `Class ${id}`;
};

const getSubjectName = (id: number) => {
  const found = subjects.find((s) => s.id === id);
  return found ? `${found.name} (${found.code})` : `Subject ${id}`;
};

return (
    <div style={{ padding: "2.5rem" }}>
        <Navbar />
      <h1>Timetable</h1>

      {/* Conditionally render the form only if the user is an admin */}
      {isAdmin && (
        <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f9f9f9", borderRadius: "8px" }}>
          <h3>Add timetable entry</h3>

          <select value={classId} onChange={(e) => setClassId(e.target.value)}>
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.section}
              </option>
            ))}
          </select>

          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            <option value="">Select subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Day (e.g. Monday)"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <button onClick={handleCreateEntry}>Add Entry</button>
        </div>
      )}

      {/* Current timetable list visible to everyone */}
      <h3>Current timetable</h3>
      <ul>
        {timetable.map((t) => (
          <li key={t.id}>
            {getClassName(t.class_id)} — {getSubjectName(t.subject_id)} — {t.day_of_week}, {t.start_time} to {t.end_time}
          </li>
        ))}
      </ul>
    </div>
  );

}

export default TimetablePage;