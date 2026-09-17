import {useState} from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

interface LoginPageProps{
    onLoginSuccess: (token:string)=> void;
    }
function LoginPage({onLoginSuccess} : LoginPageProps){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      onLoginSuccess(data.token);
      navigate("/dashboard");
    } catch(err){
      setError("Something went wrong");
    }      
};


return (
    <div className="login-page">
      <h1 className="login-title">School ERP</h1>
      <div className="login-box">
        <h2>Login</h2>
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;