import { useEffect, useState } from "react";

interface SubjectItem {
    id : number;
    name : string;
    code : string;
}
interface SubjectPagesProps {
    token : string
}

function SubjectsPage({token}:SubjectPagesProps){
    const [subjects, setSubjects]= useState<SubjectItem[]>([]);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");

    const fetchSubjects = async() =>{
        try{
            const response = await fetch ("http://localhost:8080/api/subjects",{
                method : "GET",
                headers : { "Authorization": `Bearer ${token}` },

            });
            if (!response.ok){
                return;
            }
            const data = await response.json();
            setSubjects(data);
        } catch (err){
            console.error("Failed to fetch subjects",err);
                }
    };

    useEffect (() => {
        fetchSubjects();
    }, [token]);

    const handleCreateSubject = async() =>{
        try {
            const response = await fetch("http://localhost:8080/api/subjects",{
              method : "POST",
              headers :   {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({name, code}),
            });
            //success check 
            if (!response.ok){
                console.error("Failed to create subject");
                return;
            }

            fetchSubjects();
            setName("");
            setCode("");
        } catch (err){
            console.error("Error creating class",err);
        }
    };
    return (
    <div style={{ padding: "20px" }}>
      <h2>Subjects Management</h2>

      {/* Form for adding a subject */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Subject Name (e.g., Mathematics)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Subject Code (e.g., MATH101)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <button onClick={handleCreateSubject} style={{ padding: "8px 16px" }}>
          Add Subject
        </button>
      </div>

      {/* List of existing subjects */}
      <h3>Existing Subjects</h3>
      <ul>
        {subjects.map((sub) => (
          <li key={sub.id}>
            {sub.name} — <code>{sub.code}</code>
          </li>
        ))}
      </ul>
    </div>
  );


 
}
export default SubjectsPage;