import { jwtDecode } from "jwt-decode";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, CircularProgress, Alert, Button } from "@mui/material";
import HeaderResident from '../../components/HeaderResident/HeaderResident'
import { Link } from "react-router-dom";

const AssignedRoom = () => {
    const [room, setRoom] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                // Récupérer le JWT depuis le stockage local
                const token = localStorage.getItem("authToken");
                if (!token) {
                    throw new Error("Aucun token trouvé. Veuillez vous connecter.");
                }

                // Décoder le token pour extraire residentId
                const decodedToken = jwtDecode(token);
                const residentId = decodedToken.userId;

                // Récupérer la chambre assignée
                const response = await axios.get(`http://localhost:8080/api/rooms/resident/assigned`, {
                    params: { residentId }
                });

                setRoom(response.data);
            } catch (err) {
                setError(err.response ? err.response.data : "Erreur lors de la récupération des données");
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
                sx={{ backgroundColor: "#e8f5e9", padding: 4 }}
            >
                {room ? (
                    <Card sx={{
                        width: 500,
                        height: 370,
                        boxShadow: 6,
                        borderRadius: 4,
                        backgroundColor: "#ffffff",
                        overflow: "hidden",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                            transform: "translateY(-10px)",
                            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)"
                        }
                    }}>
                        <CardContent>
                            <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold', color: '#388e3c' , marginBottom:"30px" }}>
                                Détails de la Chambre Assignée
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1" sx={{ color: "#555", fontSize: "1rem", marginBottom:"20px" }}>
                                    <strong>Numéro de Chambre:</strong> {room.roomNumber}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#555", fontSize: "1rem", marginBottom:"20px"  }}>
                                    <strong>Taille:</strong> {room.size} m²
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#555", fontSize: "1rem", marginBottom:"20px"  }}>
                                    <strong>Équipement:</strong> {room.equipment}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#555", fontSize: "1rem", marginBottom:"20px"  }}>
                                    <strong>Statut:</strong> {room.status}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#555", fontSize: "1rem", marginBottom:"20px"  }}>
                                    <strong>Prix:</strong> {room.price} dh/mois
                                </Typography>
                            </Box>
                            <Link to="/resident-dash/incident"><Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{
                                    padding: "10px 20px",
                                    borderRadius: 3,
                                    fontWeight: 'bold',
                                    backgroundColor: "#388e3c",
                                    "&:hover": {
                                        backgroundColor: "#2c6d31"
                                    }
                                }}
                            >
                               Signaler un incident
                            </Button></Link>
                        </CardContent>
                    </Card>
                ) : error ? (
                    <Alert severity="error" sx={{ width: "100%", maxWidth: 400, margin: "0 auto", borderRadius: 2, fontWeight: 'bold' }}>
                        {error}
                    </Alert>
                ) : (
                    <CircularProgress sx={{ color: "#388e3c" }} />
                )}
            </Box>
        </div>
    );
};

export default AssignedRoom;
