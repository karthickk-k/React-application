import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container, Card, Typography, Avatar, Box, Divider,
    List, ListItemButton, ListItemText, Drawer, CircularProgress, Button
} from "@mui/material";
import { API } from "../constants/urls";
import Secondarybutton from "./Secondarybutton";
const drawerWidth = 200;
function Sidebar({ selectedHash }) {
    return (
        <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", mt: 0, p: 2, borderRight: "2px solid #e0e0e0", } }}>
            <Box sx={{ overflow: "auto" }}>
                <List>
                    {["profile", "address", "company", "bank", "university"].map(section => (
                        <ListItemButton key={section} component="a" href={`#${section}`} selected={selectedHash === `#${section}`} sx={{ "&.Mui-selected": { backgroundColor: "#40A865", borderRadius: 1, color: "#fff", "&:hover": { backgroundColor: "#40A865" } } }}>
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
                const res = await fetch(`${API.USER_PROFILE}${userId}`);
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
                    <Secondarybutton size="large"
                        onClick={handleLogout}>Logout</Secondarybutton>
                </Box>
                <Card sx={{ mb: 3, p: 3, borderRadius: 5, boxShadow: 10, backgroundColor: "#DDF6D2" }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar src={user.image} sx={{ width: 100, height: 100, mb: 2 }} />
                        <Typography variant="h5">{user.firstName} {user.lastName}</Typography>
                        <Typography>{user.email}</Typography>
                        <Typography>{user.phone}</Typography>
                        <Typography>{user.age}</Typography>
                    </Box>
                </Card>

                <Divider sx={{ my: 2 }} />
                <Card id="address" sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h5" color="#06923E" mb={1}>Address</Typography>
                    <Typography>{user.address?.address}, {user.address?.city}, {user.address?.postalCode}</Typography>
                </Card>

                <Card id="company" sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h5" color="#06923E" mb={1}>Company</Typography>
                    <Typography>{user.company?.name}</Typography>
                    <Typography>{user.company?.title}</Typography>
                </Card>

                <Card id="bank" sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h5" color="#06923E" mb={1}>Bank</Typography>
                    <Typography>Card Number: {user.bank?.cardNumber}</Typography>
                    <Typography>Card Type: {user.bank?.cardType}</Typography>
                </Card>

                <Card id="university" sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h5" color="#06923E" mb={1}>University</Typography>
                    <Typography>{user.university}</Typography>
                </Card>
            </Container>
        </Box>
    );
}

export default UserProfile;