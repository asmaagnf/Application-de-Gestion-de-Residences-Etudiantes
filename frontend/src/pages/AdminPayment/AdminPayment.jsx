import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { getPaymentsByResident, getPaymentsByRoom, addPayment } from "../../utils/api";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";

function AdminPayment() {
  const [residentId, setResidentId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [payments, setPayments] = useState([]);

  // State for dialog
  const [open, setOpen] = useState(false);
  const [newRoomId, setNewRoomId] = useState("");
  const [newResidentId, setNewResidentId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");

  // Fetch payments by resident
  const handleSearchByResident = async () => {
    const data = await getPaymentsByResident(residentId);
    setPayments(data);
  };

  // Fetch payments by room
  const handleSearchByRoom = async () => {
    const data = await getPaymentsByRoom(roomId);
    setPayments(data);
  };

  // Add a payment
  const handleAddPayment = async () => {
    try {
      await addPayment(newRoomId, newResidentId, amountPaid);
      alert("Payment added successfully!");
      setOpen(false); // Close the dialog after submission
    } catch (error) {
      alert("Error adding payment: " + error.message);
    }
  };

  return (
     <div>
    <HeaderAdmin />
    <Container>
      <Typography variant="h4" gutterBottom>
        Payment Management
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Resident ID"
            fullWidth
            value={residentId}
            onChange={(e) => setResidentId(e.target.value)}
          />
          <Button variant="contained" onClick={handleSearchByResident} fullWidth>
            Search Payments by Resident
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Room ID"
            fullWidth
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <Button variant="contained" onClick={handleSearchByRoom} fullWidth>
            Search Payments by Room
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={2}>
        {payments.map((payment) => (
          <Grid item xs={12} key={payment.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Payment ID: {payment.id}</Typography>
                <Typography>Resident ID: {payment.resident.id}</Typography>
                <Typography>Room ID: {payment.room.id}</Typography>
                <Typography>Amount Paid: {payment.amountPaid}</Typography>
                <Typography>Balance: {payment.balance}</Typography>
                <Typography>Due Date: {new Date(payment.dueDate).toLocaleDateString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Payment Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        style={{ marginTop: "20px" }}
      >
        Add Payment
      </Button>

      {/* Add Payment Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details below to add a new payment.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Room ID"
            type="text"
            fullWidth
            value={newRoomId}
            onChange={(e) => setNewRoomId(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Resident ID"
            type="text"
            fullWidth
            value={newResidentId}
            onChange={(e) => setNewResidentId(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Amount Paid"
            type="number"
            fullWidth
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddPayment} color="primary">
            Add Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </div>
  );
}

export default AdminPayment;
