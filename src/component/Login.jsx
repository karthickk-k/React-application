import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import { Container, Typography, Paper, Box, Alert, } from "@mui/material";
import { API } from "../constants/urls";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import Field from "./TextField";
import Primerybutton from "./Primerybutton";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(API.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 30,
        }),
        withCredentials: "include",
      });
      const data = await res.json();
      console.log(data);
      if (!data.accessToken || !data.id) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userId", data.id);
      const userRes = await fetch(API.USER_BY_ID(data.id), {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });
      const user = await userRes.json();
      localStorage.setItem("userRole", user.role);

      if (user.role === "moderator") {
        throw new Error("Access denied for moderators");
      }
      dispatch(
        setCredentials({
          username,
          password,
          token: data.accessToken,
          userId: data.id,
          role: user.role,
        })
      );

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      id="background-images"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}>
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            boxShadow: 8,
            borderRadius: 5,
            p: 4,
            backgroundColor: "transparent",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>Sign in</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} mt={5}>
            <AccountCircleIcon sx={{ mt: 3, mr: 1 }} />
            <Field
              sx={{
                width: 300,
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'black',
                  fontWeight: 600,
                  fontSize: '20px',
                },
              }}
              label="Username"
              variant="standard"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <LockOutlineIcon sx={{ mt: 5, mr: 1 }} />
            <Field
              sx={{
                mt: 2,
                width: 300,
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'black',
                  fontWeight: 600,
                  fontSize: '20px',
                },
              }}
              label="Password"
              type="password"
              variant="standard"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Primerybutton fullWidth type="submit">
              Login
            </Primerybutton>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;

