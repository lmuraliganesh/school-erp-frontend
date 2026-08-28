import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      // 1. Call fetch on "http://localhost:8080/api/login"
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // 2. If response is not ok (check response.ok), setError("Invalid email or password") and return
      if (!response.ok) {
        setError("Invalid email or password");
        return;
      }

      // 3. Parse the JSON response: const data = await response.json()
      const data = await response.json();

      // 4. Call setToken(data.token)
      setToken(data.token);

      // 5. Call fetchUsers(data.token) — we'll write this function next
      fetchUsers(data.token);
    } catch (err) {
      setError("Something went wrong");
    }
  };

  const fetchUsers = async (authToken: string) => {
    try {
      // 1. Call fetch on "http://localhost:8080/api/users"
      const response = await fetch("http://localhost:8080/api/users", {
        method: "GET",
        headers: { "Authorization": `Bearer ${authToken}` },
      });

      if (!response.ok) {
        setError("Failed to fetch users");
        return;
      }

      // 2. Parse JSON: const data = await response.json()
      const data = await response.json();

      // 3. Call setUsers(data)
      setUsers(data);
    } catch (err) {
      setError("Something went wrong while fetching users");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>School ERP</h1>

      {!token && (
        <div>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}

      {token && (
        <div>
          <h2>User List</h2>
          <ul>
            {users.map((u) => (
              <li key={u.id}>
                {u.name} — {u.email} — {u.role}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;