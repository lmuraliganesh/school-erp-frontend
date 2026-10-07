import { useState,useEffect } from "react";
import Navbar from "./Navbar";

interface AnnouncementItem{
    id : number;
    title : string;
    content : string;
    author_id : number;
    created_at : string;
}
interface AnnouncementPageProps{
    token  : string;
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

function AnnouncementPage({token}: AnnouncementPageProps){
    const [announcement, setAnnouncement] = useState<AnnouncementItem[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
   

     const decoded = decodeToken(token);
     const isAdmin = decoded?.role === "admin";
     const isTeacher = decoded?.role === "teacher";

     const fetchAnnouncement = async () => {
        const response = await fetch("http://localhost:8080/api/announcements",{
            headers : {"Authorization": `Bearer ${token}`},
        });
        if (response.ok){
            setAnnouncement(await response.json());
        }
     }
     useEffect (() => {
        fetchAnnouncement();
    }, [token]);
    const handleCreateAnnouncement = async() => {
        try {
            const response = await fetch("http://localhost:8080/api/announcements",{
                method : "POST",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" :`Bearer ${token}`,
                },
            body : JSON.stringify({
            title : String(title),
            content: String(content),
            }),
        });

            if (!response.ok){
        console.error("Failed to create Announcement");
        return;
    }

    fetchAnnouncement();
    setTitle("");
    setContent("");
    }catch (err){
        console.error("Error creating in announcements", err);
    }
    };

    return (
        <div style={{ padding: "2.5rem" }}>
            <Navbar />
    <h1>Announcements</h1>

    {(isAdmin || isTeacher) && (
  <div style={{ marginBottom: "1.5rem" }}>
    <h3>Post an announcement</h3>
    <input
      type="text"
      placeholder="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
    <textarea
      placeholder="Write your announcement..."
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
    <button onClick={handleCreateAnnouncement}>Post</button>
    
  </div>
    )}
 <h3>Recent announcements</h3>
      {announcement.map((a) => (
        <div key={a.id} style={{ marginBottom: "1rem" }}>
          <strong>{a.title}</strong>
          <p>{a.content}</p>
          <small>{new Date(a.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}


export default AnnouncementPage;



