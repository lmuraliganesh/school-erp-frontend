import { useState, useEffect } from "react";

interface ClassItem {
  id: number;
  name: string;
  section: string;
}

interface ClassesPageProps {
  token: string;
}

function ClassesPage({ token }: ClassesPageProps) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [name, setName] = useState("");
  const [section, setSection] = useState("");

  
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/classes", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setClasses(data);
      } catch (err) {
        console.error("Failed to fetch classes", err);
      }
    };
useEffect(() =>{
  
    fetchClasses();
  }, [token]);

const handleCreateClass = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name, section }),
      });

      if (!response.ok) {
        console.error("Failed to create class");
        return;
      }

      // Refresh the list and clear inputs on success
      fetchClasses();
      setName("");
      setSection("");
    } catch (err) {
      console.error("Error creating class", err);
    }
  };

 return (
  <div style={{ padding: "2rem" }}>
    <h1>Classes</h1>

    <div style={{ marginBottom: "1.5rem" }}>
      <h3>Create a class</h3>
      <input
        type="text"
        placeholder="Name (e.g. Grade 10)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Section (e.g. A)"
        value={section}
        onChange={(e) => setSection(e.target.value)}
      />
      <button onClick={handleCreateClass}>Create</button>
    </div>

    <ul>
      {classes.map((c) => (
        <li key={c.id}>{c.name} — Section {c.section}</li>
      ))}
    </ul>
  </div>
);
}

export default ClassesPage;