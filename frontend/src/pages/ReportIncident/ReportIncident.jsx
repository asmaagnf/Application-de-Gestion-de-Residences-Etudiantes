import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { TextField, Button, Snackbar, Alert, Typography, Container, Box } from "@mui/material";
import HeaderResident from '../../components/HeaderResident/HeaderResident';

const ReportIncident = () => {
    const [room, setRoom] = useState(null);
    const [description, setDescription] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssignedRoom = async () => {
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
                const response = await axios.get("http://localhost:8080/api/rooms/resident/assigned", {
                    params: { residentId },
                });

                if (response.status === 200) {
                    setRoom(response.data);
                }
            } catch (err) {
                setError(err.response ? err.response.data : "Erreur lors de la récupération de la chambre assignée.");
            }
        };

        fetchAssignedRoom();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Récupérer le JWT depuis le stockage local
            const token = localStorage.getItem("authToken");
            if (!token) {
                throw new Error("Aucun token trouvé. Veuillez vous connecter.");
            }

            // Décoder le token pour extraire residentId
            const decodedToken = jwtDecode(token);
            const residentId = decodedToken.userId;

            // Appel API pour soumettre l'incident
            const response = await axios.post(
                "http://localhost:8080/api/incidents/create",
                null,
                {
                    params: {
                        roomId: room.id,
                        residentId,
                        description,
                    },
                }
            );

            if (response.status === 200) {
                setSuccess(true);
                setDescription("");
            }
        } catch (err) {
            setError(err.response ? err.response.data : "Erreur lors du signalement de l'incident.");
        }
    };

    return (
        <div>
            <HeaderResident />
            <Container maxWidth="sm" sx={{ mt: 5 }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        backgroundColor: "#f9f9f9",
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
                        Signaler un Incident
                    </Typography>

                    {room ? (
                        <TextField
                            label="Chambre Assignée"
                            value={`Chambre ${room.roomNumber}`}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    ) : (
                        <Typography color="error">Aucune chambre assignée trouvée.</Typography>
                    )}

                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={4}
                        required
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={!room}
                    >
                        Soumettre
                    </Button>
                </Box>

                <Snackbar
                    open={success}
                    autoHideDuration={3000}
                    onClose={() => setSuccess(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: "100%" }}>
                        Incident signalé avec succès !
                    </Alert>
                </Snackbar>
                {error && (
                    <Snackbar
                        open={!!error}
                        autoHideDuration={3000}
                        onClose={() => setError(null)}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    >
                        <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
                            {error}
                        </Alert>
                    </Snackbar>
                )}
            </Container>
        </div>
    );
};

export default ReportIncident;
