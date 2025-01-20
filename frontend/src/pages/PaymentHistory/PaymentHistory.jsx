import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Chip } from '@mui/material';
import HeaderResident from '../../components/HeaderResident/HeaderResident';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                // Récupérer le token depuis localStorage
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Aucun token trouvé. Veuillez vous connecter.');
                }

                // Décoder le token pour extraire residentId
                const decodedToken = jwtDecode(token);
                const residentId = decodedToken.userId;

                // Faire un appel API pour obtenir les paiements par residentId
                const response = await axios.get(`http://localhost:8080/api/payments/resident/history/${residentId}`);
                setPayments(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPayments();
    }, []);

    const handleDownloadReceipt = (paymentId) => {
        axios.get(`http://localhost:8080/api/payments/receipt/${paymentId}`, {
            responseType: 'blob',
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'recu_paiement.pdf');
            document.body.appendChild(link);
            link.click();
        })
        .catch(error => {
            console.error('Erreur lors du téléchargement du reçu:', error);
        });
    };

    // Function to get the payment status (including Retard)
    const getStatusChip = (paid, dueDate) => {
        const currentDate = new Date();
        const dueDateObj = new Date(dueDate);
        
        if (paid) {
            return (
                <Chip label="Payé" color="success" variant="outlined" size="small" />
            );
        } else if (currentDate > dueDateObj) {
            return (
                <Chip label="Retard" color="warning" variant="outlined" size="small" />
            );
        } else {
            return (
                <Chip label="En Attente" color="error" variant="outlined" size="small" />
            );
        }
    };

    return (
        <div>
            <HeaderResident />
            <div style={{ padding: '20px' }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Historique de vos Paiements
                </Typography>
                {error && <Typography color="error" variant="body1">{error}</Typography>}
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Date de Paiement</TableCell>
                                <TableCell align="center">Montant Dû</TableCell>
                                <TableCell align="center">Montant Payé</TableCell>
                                <TableCell align="center">Statut</TableCell>
                                <TableCell align="center">Télécharger le Reçu</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.length > 0 ? (
                                payments.map(payment => (
                                    <TableRow key={payment.id}>
                                        <TableCell align="center">{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                                        <TableCell align="center">{payment.amountDue} MAD</TableCell>
                                        <TableCell align="center">{payment.amountPaid} MAD</TableCell>
                                        <TableCell align="center">{getStatusChip(payment.paid, payment.dueDate)}</TableCell>
                                        <TableCell align="center">
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={() => handleDownloadReceipt(payment.id)} 
                                                disabled={!payment.paid}
                                            >
                                                Télécharger le Reçu
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Aucun paiement trouvé</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default PaymentHistory;
