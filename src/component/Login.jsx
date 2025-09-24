import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
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


      const userRes = await fetch(`https://dummyjson.com/users/${data.id}`, {
        headers: { "Authorization": `Bearer ${data.accessToken}` }
      });
      const user = await userRes.json();

      localStorage.setItem("userRole", user.role);

      if (user.role === "moderator") {
        throw new Error("Access denied for moderators");
      }

      localStorage.setItem("userRole", user.role);

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
    <Container maxWidth="xs">
      <Box
        sx={{
          boxShadow: 6,
          borderRadius: 5,
          px: 4,
          py: 6,
          marginTop: 8,
          alignItems: "center",
        }}
      >
        <Typography variant="h5" align="center">Sign in</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} mt={5}>
          <AccountCircleIcon sx={{ mt: 2, mr: 1 }} />
          <TextField
            sx={{ width: 280 }}
            label="Username"
            variant="standard"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <LockOutlineIcon sx={{ mt: 7, mr: 1 }} />
          <TextField
            sx={{ width: 280, mt: 5 }}
            label="Password"
            type="password"
            variant="standard"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button fullWidth type="submit" variant="outlined"
            sx={{
              mt: 5, mb: 2,
              backgroundColor: '#FFFF',
              color: '#50C878',
              borderColor: '#50C878',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#40A865',
                borderColor: '#40A865',
                color: '#FFFF',
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;