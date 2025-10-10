import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead,
  FormControl, Typography, TableRow, Paper, Avatar, Button, Box, TextField, Select,
  MenuItem, ToggleButtonGroup, ToggleButton, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, Grid, Card, CardContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { API } from "../constants/urls";
import Secondarybutton from "./Secondarybutton";
import Field from "./TextField";
import '../index.css'
const toggleButtonStyle = {
  borderRadius: "20px",
  px: 2,
  textTransform: "capitalize",
  borderColor: "#10B981",
  "&.Mui-selected, &:hover": {
    backgroundColor: "#10B981", color: "#FFFF",
  },
};

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("nameAsc");
  const [totalUsers, setTotalUsers] = useState(0);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    company: "",
  });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [view, setView] = useState("table");

  useEffect(() => {
    fetchUsers();
  }, [skip, limit, search]);

  const fetchUsers = async () => {
    try {
      const url = search.trim() ? API.SEARCH_USERS(search, limit, skip) :
        `${API.USERS}?limit=${limit}&skip=${skip}`;
      const res = await fetch(url);
      const data = await res.json();
      const roles = ["user", "moderator", "admin"];
      const usersWithRoles = data.users.map((u, idx) => ({ ...u, role: roles[idx % roles.length], }));
      setUsers(usersWithRoles); setTotalUsers(data.total);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleOpen = (user = null) => {
    setEditUser(user);
    setFormData(user ? {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      company: user.company?.name || "",
    } : {
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      company: ""
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
  };

  const handleSubmit = async () => {
    const apiUrl = editUser ? API.USER_BY_ID(editUser.id) : API.ADD_USER;
    const method = editUser ? "PUT" : "POST";
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      age: Number(formData.age),
      company: { name: formData.company },
    };
    try {
      const res = await fetch(apiUrl, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok && editUser && res.status === 404) {
        setUsers((prev) => prev.map((u) => (
          u.id === editUser.id ? { ...u, ...payload } : u)));
        handleClose(); return;
      }
      const data = await res.json();
      if (method === "POST") {
        setUsers((prev) => [...prev, {
          ...payload, id: data.id || Date.now(),
          company: payload.company
        },]);
      } else {
        setUsers((prev) => prev.map((u) => u.id === (data.id || editUser.id) ? { ...u, ...payload } : u));
      }
      handleClose();
    } catch (err) {
      console.error("Error during submission:", err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(API.USER_BY_ID(userToDelete.id), {
        method: "DELETE",
      });
      if (res.ok || res.status === 404) {
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    } finally {
      setDeleteDialog(false); setUserToDelete(null);
    }
  };

  const handleDeleteOpen = (user) => {
    setUserToDelete(user); setDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialog(false); setUserToDelete(null);
  };

  const handleNext = () => setSkip((prev) => Math.min(prev + limit, totalUsers - limit));
  const handlePrev = () => setSkip((prev) => Math.max(prev - limit, 0));
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value)); setSkip(0);
  };
  const handleSortChange = (e) => setSortBy(e.target.value);
  const handleRoleChange = (_, newRole) => {
    if (newRole) setRoleFilter(newRole);
  };

  const handleLogout = () => {
    localStorage.clear(); navigate("/login");
  };

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    return (
      (roleFilter === "all" || u.role === roleFilter) && (fullName.includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())));
  })
    .sort((a, b) => {
      if (sortBy === "nameAsc")
        return a.firstName.localeCompare(b.firstName);
      if (sortBy === "nameDesc")
        return b.firstName.localeCompare(a.firstName);
      return 0;
    });

  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(totalUsers / limit);

  return (

    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2}
        p={2}
        bgcolor="#FFFF"
        borderRadius={2}
        boxShadow={2}
        flexWrap="wrap">
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Field
            size="small"
            placeholder="Search users"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSkip(0);
            }} />

          <ToggleButtonGroup value={roleFilter} exclusive onChange={handleRoleChange} size="small">
            <ToggleButton sx={toggleButtonStyle} value="all">All</ToggleButton>
            <ToggleButton sx={toggleButtonStyle} value="user">User</ToggleButton>
            <ToggleButton sx={toggleButtonStyle} value="moderator"> Moderator</ToggleButton>
            <ToggleButton sx={toggleButtonStyle} value="admin"> Admin</ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup value={sortBy} exclusive onChange={handleSortChange} size="small">
            <ToggleButton sx={toggleButtonStyle} value="nameAsc">Asc</ToggleButton>
            <ToggleButton sx={toggleButtonStyle} value="nameDesc">Desc</ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, val) => val && setView(val)}
            size="small"
          >
            {["table", "grid"].map((v) => (
              <ToggleButton key={v} value={v} sx={toggleButtonStyle}>
                {v}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Button variant="contained"
            sx={{
              backgroundColor: "#10B981",
              color: "#FFF", borderRadius: 6,
              "&:hover": { backgroundColor: "#059669" },
            }}
            size="medium"
            onClick={() => handleOpen(null)}> + Add User
          </Button>
        </Box>

        <Secondarybutton size="large"
          onClick={handleLogout}>Logout</Secondarybutton>
      </Box>

      {view === "table" ? <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, maxHeight: 480, overflow: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {["Avatar", "Name", "Email", "Age", "Company", "Actions"].map((head) => (
                <TableCell key={head}
                  sx={{
                    fontWeight: "bold",
                    color: "#FFF", backgroundColor: "#10B981",
                  }
                  }> {head}
                </TableCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}
                sx={{ "&:hover": { backgroundColor: "#f3f4f6" }, }}>
                <TableCell>
                  <Avatar src={user.image}
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/user/${user.id}`)}
                  />
                </TableCell>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.company?.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(user)}>
                    <EditIcon color="primary" /></IconButton>
                  <IconButton
                    onClick={() => handleDeleteOpen(user)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
      </TableContainer>

        : <Grid container spacing={3} >
          {filteredUsers.map((u) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={u.id}>
              <Card
                sx={{
                  width: 210, height: 200, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                  boxShadow: 2, borderRadius: 5
                }}>
                <Avatar
                  src={u.image}
                  sx={{
                    width: 50,
                    height: 50,
                    mb: 2, mt: 2,
                    boxShadow: 4, borderRadius: 2, cursor: "pointer", transition: "all 0.3s ease-in-out",
                    "&:hover": { transform: "translateY(-3px)", boxShadow: "0px 8px 20px #B0DB9C" }
                  }}
                  onClick={() => navigate(`/user/${u.id}`)}
                />
                <CardContent
                  sx={{ textAlign: "center" }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#374151" }}>
                    {u.firstName} {u.lastName}
                  </Typography>
                  <IconButton
                    onClick={() => handleOpen(u)}>
                    <EditIcon color="primary" /></IconButton>
                  <IconButton
                    onClick={() => handleDeleteOpen(u)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>}

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
        <FormControl size="small" sx={{ minWidth: 80, borderRadius: 2 }}>
          <Select value={limit} onChange={handleLimitChange} autoWidth>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={25}>25</MenuItem>
          </Select>
        </FormControl>

        <Box display="flex" gap={2} alignItems="center">
          <Button variant="contained" sx={{ backgroundColor: "#57564F", color: "#FFF" }} onClick={handlePrev} disabled={skip === 0}> Previous</Button>
          <Typography>Page {currentPage} of {totalPages}</Typography>
          <Button variant="contained" sx={{ backgroundColor: "#40A865", color: "#FFF" }} onClick={handleNext} disabled={skip + limit >= totalUsers}>Next</Button>
        </Box>
      </Box>

      <Dialog open={open}
        onClose={handleClose}
        fullWidth maxWidth="sm"
        PaperProps={{
          sx: {
            boxShadow: 8,
            borderRadius: 5,
            p: 4,
          },
        }}
      >
        <DialogTitle>{editUser ? "Edit User" : "Add New User"} </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2, }}>
          {["firstName", "lastName", "email", "age", "company"].map((field) => (
            <TextField key={field}
              type={field === "age" ? "number" : "text"}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
              fullWidth />))}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}
            sx={{
              backgroundColor: "#57564F",
              color: "#FFFF",
              width: "80px",
              height: "40px",
              borderRadius: 2,
            }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}
            sx={{
              backgroundColor: "#40A865",
              color: "#FFFF",
              width: "80px",
              height: "40px",
              borderColor: "#50C878",
              borderRadius: 2,
            }}>
            {editUser ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog}
        onClose={handleDeleteClose}
        PaperProps={{
          sx: {
            boxShadow: 8,
            borderRadius: 5,
            p: 4,
          },
        }}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete
          <strong> {userToDelete?.firstName} {userToDelete?.lastName}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>No</Button>
          <Button color="error" onClick={handleDelete}>Yes</Button>
        </DialogActions>
      </Dialog>
    </Container>);
};

export default UsersList;