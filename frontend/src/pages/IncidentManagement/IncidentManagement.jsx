import React, { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
} from '@mui/material';
import axios from 'axios';
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';

const IncidentManagement = () => {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [status, setStatus] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [residentName, setResidentName] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/incidents/list');
      setIncidents(response.data);
      setFilteredIncidents(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des incidents:', err);
    }
  };

  const handleSearch = () => {
    const filtered = incidents.filter((incident) => {
      return (
        (roomNumber ? incident.room?.roomNumber.includes(roomNumber) : true) &&
        (residentName ? incident.resident?.username.toLowerCase().includes(residentName.toLowerCase()) : true) &&
        (status ? incident.status === status : true)
      );
    });
    setFilteredIncidents(filtered);
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.put(`http://localhost:8080/api/incidents/update/${selectedIncident.id}`, null, {
        params: { status },
      });
      setSelectedIncident(null);
      fetchIncidents();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
    }
  };

  const handleAssignTechnician = async (incidentId) => {
    try {
      await axios.put(`http://localhost:8080/api/incidents/assign/${incidentId}`, null, {
        params: { technicianName },
      });
      fetchIncidents();
      setTechnicianName(''); // Reset after successful assignment
    } catch (err) {
      console.error('Erreur lors de l\'assignation du technicien:', err);
    }
  };

  const handleUnassignTechnician = async (incidentId) => {
    try {
      await axios.put(`http://localhost:8080/api/incidents/unassign/${incidentId}`);
      fetchIncidents();
    } catch (err) {
      console.error('Erreur lors de la désassignation du technicien:', err);
    }
  };

  const getStatusChip = (status) => {
    let color;
    switch (status) {
      case 'En Attente':
        color = 'error'; // Red
        break;
      case 'En Cours':
        color = 'warning'; // Yellow
        break;
      case 'Résolu':
        color = 'success'; // Green
        break;
      default:
        color = 'default';
    }
    return <Chip label={status} color={color} variant="outlined" size="small" />;
  };

  return (
    <div>
      <HeaderAdmin />
      <Box p={3}>
        <Typography variant="h4" mb={3}>
          Gestion des Incidents
        </Typography>

        {/* Filtres de recherche */}
        <Box mb={3} display="flex" alignItems="center">
          <TextField
            label="Nom du Résident"
            variant="outlined"
            size="small"
            value={residentName}
            onChange={(e) => setResidentName(e.target.value)}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Numéro de Chambre"
            variant="outlined"
            size="small"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            displayEmpty
            variant="outlined"
            size="small"
            sx={{ mr: 2 }}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="En Attente">En Attente</MenuItem>
            <MenuItem value="En Cours">En Cours</MenuItem>
            <MenuItem value="Résolu">Résolu</MenuItem>
          </Select>
          <Button variant="contained" onClick={handleSearch}>
            Rechercher
          </Button>
        </Box>

        {/* Tableau des Incidents */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Numéro de Chambre</TableCell>
                <TableCell>Nom du Résident</TableCell>
                <TableCell>Technicien Assigné</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {filteredIncidents.map((incident) => (
    <TableRow key={incident.id}>
      <TableCell>{incident.id}</TableCell>
      <TableCell>{incident.description}</TableCell>
      <TableCell>{incident.room?.roomNumber}</TableCell>
      <TableCell>{incident.resident?.username}</TableCell>
      <TableCell>{incident.technicianName || 'Non Assigné'}</TableCell>
      <TableCell>{getStatusChip(incident.status)}</TableCell>
      <TableCell>
  <FaEdit
    variant="contained"
    style={{ color: "green", marginRight: "20px" }}
    onClick={() => {
      setSelectedIncident(incident);
      setStatus(incident.status);
      setUpdateStatusDialogOpen(true); // Open only the update status dialog
    }}
  />
   
  {incident.technicianName ? (
    <Button
      variant="contained"
      size="small"
      onClick={() => handleUnassignTechnician(incident.id)}
      sx={{ ml: 1 }}
    >
      Désassigner Technicien
    </Button>
  ) : (
    <Button
      variant="contained"
      size="small"
      onClick={() => {
        setSelectedIncident(incident);
        setTechnicianName('');
        setAssignDialogOpen(true); // Open only the assign technician dialog
      }}
      sx={{ ml: 1 }}
    >
      Assigner Technicien
    </Button>
  )}
</TableCell>
    </TableRow>
  ))}
</TableBody>
          </Table>
        </TableContainer>

        {/* Dialog pour mettre à jour le statut */}
        <Dialog open={updateStatusDialogOpen} onClose={() => setUpdateStatusDialogOpen(false)}>
  <DialogTitle>Mettre à Jour le Statut de l'Incident</DialogTitle>
  <DialogContent>
    <Select
      fullWidth
      value={status}
      onChange={(e) => setStatus(e.target.value)}
    >
      <MenuItem value="En Attente">En Attente</MenuItem>
      <MenuItem value="En Cours">En Cours</MenuItem>
      <MenuItem value="Résolu">Résolu</MenuItem>
    </Select>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setUpdateStatusDialogOpen(false)}>Annuler</Button>
    <Button
      onClick={() => {
        handleUpdateStatus();
        setUpdateStatusDialogOpen(false); // Close dialog after updating
      }}
      variant="contained"
    >
      Enregistrer
    </Button>
  </DialogActions>
</Dialog>

{/* Dialog for assigning technician */}
<Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)}>
  <DialogTitle>Assigner un Technicien</DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      label="Nom du Technicien"
      value={technicianName}
      onChange={(e) => setTechnicianName(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setAssignDialogOpen(false)}>Annuler</Button>
    <Button
      onClick={() => {
        handleAssignTechnician(selectedIncident.id);
        setAssignDialogOpen(false); // Close dialog after assigning
      }}
      variant="contained"
    >
      Assigner
    </Button>
  </DialogActions>
</Dialog>
      </Box>
    </div>
  );
};

export default IncidentManagement;
