import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container, Card, Typography, Avatar, Box, Divider,
    List, ListItemButton, ListItemText, Drawer, CircularProgress, Button
} from "@mui/material";

const drawerWidth = 200;
function Sidebar({ selectedHash }) {
    return (
        <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", mt: 0 } }}>
            <Box sx={{ overflow: "auto" }}>
                <List>
                    {["profile", "address", "company", "bank", "university"].map(section => (
                        <ListItemButton key={section} component="a" href={`#${section}`} selected={selectedHash === `#${section}`} sx={{ "&.Mui-selected": { backgroundColor: "#40A865", color: "#fff", "&:hover": { backgroundColor: "#40A865" } } }}>
                            <ListItemText primary={section.charAt(0).toUpperCase() + section.slice(1)} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hash, setHash] = useState(window.location.hash || "#profile");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let userId = id || localStorage.getItem("userId");
                const token = localStorage.getItem("accessToken");
                if (!userId || !token) {
                    navigate("/login");
                    return;
                }
                const res = await fetch(`https://dummyjson.com/users/${userId}`);
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error(err);
            } finally { setLoading(false); }
        };
        fetchUser();
    }, [id, navigate]);

    useEffect(() => {
        const handleHashChange = () => setHash(window.location.hash || "#profile");
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (loading) return <Container sx={{ mt: 5, textAlign: "center" }}><CircularProgress /><Typography mt={2}>Loading...</Typography></Container>;
    if (!user) return <Container sx={{ mt: 5 }}><Typography variant="h6" align="center">User not found</Typography></Container>;

    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar selectedHash={hash} />
            <Container maxWidth="md" sx={{ mt: 3, ml: `${drawerWidth}px` }}>
                <Box display="flex" justifyContent="flex-end" mb={2}>
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
                <Card sx={{ mb: 3, backgroundColor: "#F9F5F0", boxShadow: 6, borderRadius: 5 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" p={3}>
                        <Avatar src={user.image} sx={{ width: 100, height: 100, mb: 2 }} />
                        <Typography variant="h4">{user.firstName} {user.lastName}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-around", mb: 5 }}>
                        <Box>
                            <Box><Typography component="p" sx={{ fontWeight: 600, fontSize: '18px', color: '#000000' }}>Email</Typography></Box>
                            <Box><Typography component="p" sx={{ fontWeight: 600, fontSize: '18px', color: '#000000' }}>Phone</Typography></Box>
                            <Box><Typography component="p" sx={{ fontWeight: 600, fontSize: '18px', color: '#000000' }}>Age</Typography></Box>
                        </Box>
                        <Box>
                            <Box><Typography variant="body1" component="p" sx={{ fontWeight: 400, fontSize: '18px', color: '#000000' }}>{user.email}</Typography></Box>
                            <Box><Typography variant="body1" component="p" sx={{ fontWeight: 400, fontSize: '18px', color: '#000000' }}>{user.phone}</Typography></Box>
                            <Box><Typography variant="body2" component="p" sx={{ fontWeight: 400, fontSize: '18px', color: '#000000' }}>{user.age}</Typography></Box>
                        </Box>
                    </Box>
                </Card>

                <Divider />

                <Box id="address" sx={{ mb: 3, backgroundColor: "#F9F5F0", p: 3, boxShadow: 6, borderRadius: 5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px', color: '#40A865' }}>Address</Typography>
                    <Typography>{user.address?.address}, {user.address?.city}, {user.address?.postalCode}</Typography>
                </Box>
                <Divider />

                <Box id="company" sx={{ mb: 3, backgroundColor: "#F9F5F0", p: 3, boxShadow: 6, borderRadius: 5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px', color: '#40A865' }}>Company</Typography>
                    <Typography>{user.company?.name}</Typography>
                    <Typography>{user.company?.title}</Typography>
                </Box>
                <Divider />

                <Box id="bank" sx={{ mb: 3, backgroundColor: "#F9F5F0", p: 3, boxShadow: 6, borderRadius: 5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px', color: '#40A865' }}>Bank</Typography>
                    <Typography>Card Number: {user.bank?.cardNumber}</Typography>
                    <Typography>Card Type: {user.bank?.cardType}</Typography>
                </Box>
                <Divider />

                <Box id="university" sx={{ mb: 3, backgroundColor: "#F9F5F0", p: 3, boxShadow: 6, borderRadius: 5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px', color: '#40A865' }}>University</Typography>
                    <Typography>{user.university}</Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default UserProfile;