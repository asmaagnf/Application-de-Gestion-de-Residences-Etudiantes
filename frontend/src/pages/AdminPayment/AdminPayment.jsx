import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip , CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';

const AdminPayment = () => {
  const [username, setUsername] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Récupérer les paiements par nom d'utilisateur
  const fetchPaymentsByUsername = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:8080/api/payments/resident/${username}`);
      setPayments(response.data);
    } catch (err) {
      setError('Échec de la récupération des paiements. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Gérer le traitement du paiement
  const handlePayment = async (paymentId) => {
    if (!amountPaid || isNaN(amountPaid) || amountPaid <= 0) {
      setError('Veuillez entrer un montant valide.');
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/payments/${paymentId}/pay`, null, { params: { amountPaid: parseFloat(amountPaid) } });
      setSuccessMessage('Paiement traité avec succès.');
      fetchPaymentsByUsername(); // Rafraîchir la liste des paiements
    } catch (err) {
      setError('Erreur lors du traitement du paiement. Veuillez réessayer.');
    }
  };

  // Function to get the payment status
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
      <HeaderAdmin />
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '20px' }}>Gestion des Paiements Administrateur</h2>

        {/* Rechercher un résident par nom d'utilisateur */}
        <TextField
          label="Nom d'utilisateur du résident"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          style={{ marginBottom: '20px' }}
        />
        {/* Bouton de recherche */}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchPaymentsByUsername} 
          disabled={!username}
          style={{ marginBottom: '20px' }}
        >
          Rechercher
        </Button>

        {/* Tableau des paiements */}
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Snackbar open={true} autoHideDuration={6000} onClose={() => setError('')}>
            <Alert onClose={() => setError('')} severity="error">
              {error}
            </Alert>
          </Snackbar>
        ) : payments.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date d'échéance</TableCell>
                  <TableCell>Montant Dû</TableCell>
                  <TableCell>Montant Payé</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Date de Paiement</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{payment.amountDue} MAD</TableCell>
                    <TableCell>{payment.amountPaid} MAD</TableCell>
                    <TableCell>{getStatusChip(payment.paid, payment.dueDate)}</TableCell>
                    <TableCell>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      {!payment.paid && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setSelectedPaymentId(payment.id)}
                        >
                          Traiter le Paiement
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>Aucun paiement trouvé pour ce résident.</p>
        )}

        {/* Traitement du paiement */}
        {selectedPaymentId && (
          <div style={{ marginTop: '20px' }}>
            <TextField
              label="Montant Payé"
              variant="outlined"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              fullWidth
              style={{ marginBottom: '10px' }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handlePayment(selectedPaymentId)}
              style={{ marginTop: '10px' }}
            >
              Traiter le Paiement
            </Button>
          </div>
        )}

        {/* Snackbar de succès */}
        {successMessage && (
          <Snackbar open={true} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
            <Alert onClose={() => setSuccessMessage('')} severity="success">
              {successMessage}
            </Alert>
          </Snackbar>
        )}
      </div>
    </div>
  );
};

export default AdminPayment;
