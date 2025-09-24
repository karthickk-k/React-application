import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, Button, Box, TextField, Select, MenuItem, ToggleButtonGroup, ToggleButton
} from "@mui/material";

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("nameAsc");

  useEffect(() => {
    fetchAllUsers();
  }, [skip, limit]);

  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
      const data = await res.json();
      const roles = ["user", "moderator", "admin"];
      const usersWithRoles = data.users.map((u, idx) => ({
        ...u,
        role: roles[idx % roles.length]
      }));
      setUsers(usersWithRoles);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const goToUserPage = (id) => {
    navigate(`/user/${id}`);
  };

  const handleNext = () => setSkip(prev => prev + limit);
  const handlePrev = () => setSkip(prev => Math.max(prev - limit, 0));
  const handleLimitChange = e => { setLimit(e.target.value); setSkip(0); };
  const handleSortChange = e => setSortBy(e.target.value);
  const handleRoleChange = (_, newRole) => { if (newRole) setRoleFilter(newRole); };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredUsers = users
    .filter(u => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      return (roleFilter === "all" || u.role === roleFilter) &&
        (fullName.includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
    })
    .sort((a, b) => {
      if (sortBy === "nameAsc") return a.firstName.localeCompare(b.firstName);
      if (sortBy === "nameDesc") return b.firstName.localeCompare(a.firstName);
      return 0;
    });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

      <Box display="flex" flexWrap="wrap" gap={10} alignItems="center" mb={4}>
        <TextField
          label="Search User"
          value={search}
          variant="filled"
          onChange={e => setSearch(e.target.value)}
        />

        <ToggleButtonGroup value={roleFilter} exclusive onChange={handleRoleChange} size="small">
          <ToggleButton size="large" value="all">All</ToggleButton>
          <ToggleButton value="user">User</ToggleButton>
          <ToggleButton value="moderator">Moderator</ToggleButton>
          <ToggleButton value="admin">Admin</ToggleButton>
        </ToggleButtonGroup>

        <Select value={sortBy} onChange={handleSortChange} autoWidth>
          <MenuItem value="nameAsc">Asc</MenuItem>
          <MenuItem value="nameDesc">Desc</MenuItem>
        </Select>

        <Select value={limit} onChange={handleLimitChange} autoWidth>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={25}>25</MenuItem>
        </Select>

        <Button variant="contained" size="large"
          sx={{
            mt: 3, mb: 2,
            backgroundColor: '#FFFF',
            color: '#DD0303',
            borderColor: '#DD0303',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#DD0303',
              borderColor: '#DD0303',
              color: '#FFFF',
            },
          }}

          onClick={handleLogout}>Logout</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#40A865" }}>
            <TableRow >
              <TableCell sx={{ fontWeight: 500, fontSize: '20px', color: '#FFF' }}>Avatar</TableCell>
              <TableCell sx={{ fontWeight: 500, fontSize: '20px', color: '#FFF' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 500, fontSize: '20px', color: '#FFF' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 500, fontSize: '20px', color: '#FFF' }}>Age</TableCell>
              <TableCell sx={{ fontWeight: 500, fontSize: '20px', color: '#FFF' }}>Company</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id} onClick={() => goToUserPage(user.id)} sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f3e5f5" } }}>
                <TableCell><Avatar src={user.image} /></TableCell>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.company?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" alignItems="center" mt={5} gap={5}>
        <Button variant="contained" sx={{ backgroundColor: '#57564F', color: '#FFFF' }} onClick={handlePrev} disabled={skip === 0}>Previous</Button>
        <Button variant="contained" sx={{ backgroundColor: '#40A865', color: '#FFFF' }} onClick={handleNext}>Next</Button>
      </Box>
    </Container>
  );
}

export default UsersList;