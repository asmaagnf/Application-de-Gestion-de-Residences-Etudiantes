import {jwtDecode} from "jwt-decode";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, CircularProgress, Alert } from "@mui/material";
import HeaderResident from '../../components/HeaderResident/HeaderResident'

const AssignedRoom = () => {
    const [room, setRoom] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                // Retrieve the JWT from local storage
                const token = localStorage.getItem("authToken");
                if (!token) {
                    throw new Error("No token found. Please log in.");
                }

                // Decode the token to extract residentId
                const decodedToken = jwtDecode(token);
                const residentId = decodedToken.userId;

                // Fetch the assigned room
                const response = await axios.get(`http://localhost:8080/api/rooms/resident/assigned`, {
                    params: { residentId }
                });

                setRoom(response.data);
            } catch (err) {
                setError(err.response ? err.response.data : "Error fetching data");
            }
        };

        fetchRoom();
    }, []);

    return (
        <div>
            <HeaderResident />
        
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{ backgroundColor: "#f5f5f5", padding: 4 }}
        >
            {room ? (
                <Card sx={{ width: 400, boxShadow: 3, backgroundColor: "#fff" }}>
                    <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                            Assigned Room Details
                        </Typography>
                        <Typography variant="body1">
                            <strong>Room Number:</strong> {room.roomNumber}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Size:</strong> {room.size} m²
                        </Typography>
                        <Typography variant="body1">
                            <strong>Equipment:</strong> {room.equipment}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {room.status}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Price:</strong> {room.price} dh/mois
                        </Typography>
                    </CardContent>
                </Card>
            ) : error ? (
                <Alert severity="error" sx={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
                    {error}
                </Alert>
            ) : (
                <CircularProgress />
            )}
        </Box>
        </div>
    );
};

export default AssignedRoom;
