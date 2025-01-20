import React, { useState, useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import axios from "axios";
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [residents, setResidents] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedResidentId, setSelectedResidentId] = useState("");
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [search, setSearch] = useState("");
  const [updateRoom, setUpdateRoom] = useState({
    roomNumber: "",
    size: "",
    equipment: "",
    price: "",
  });

  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    size: "",
    equipment: "",
    price: "",
  });

  useEffect(() => {
    fetchRooms();
    fetchResidents();
  }, []);

  const fetchRooms = async () => {
    const response = await axios.get("http://localhost:8080/api/rooms/list");
    setRooms(response.data);
  };

  const fetchResidents = async () => {
    const response = await axios.get("http://localhost:8080/api/users/list");
    setResidents(response.data);
  };

  const handleAssignClick = (roomId) => {
    setSelectedRoomId(roomId);
    setOpenAssignModal(true);
  };

  const handleAssignResident = async () => {
    await axios.post(`http://localhost:8080/api/rooms/assign/${selectedRoomId}`, null, {
      params: { residentId: selectedResidentId },
    });
    setOpenAssignModal(false);
    setSelectedRoomId(null);
    setSelectedResidentId("");
    fetchRooms(); // Rafraîchir la liste des chambres après l'assignation
  };

  const getResidentName = (residentId) => {
    const resident = residents.find((r) => r.id === residentId);
    return resident ? resident.username : "Inconnu";
  };

  const handleCreateRoom = async () => {
    await axios.post("http://localhost:8080/api/rooms/create", newRoom);
    setOpenCreateModal(false);
    setNewRoom({ roomNumber: "", size: "", equipment: "", price: "" });
    fetchRooms(); // Rafraîchir la liste des chambres après la création
  };

  const handleDeleteRoom = async (roomId) => {
    await axios.delete(`http://localhost:8080/api/rooms/delete/${roomId}`);
    fetchRooms(); // Rafraîchir la liste des chambres après la suppression
  };

  const handleUpdateClick = (room) => {
    setSelectedRoomId(room.id);
    setUpdateRoom({
      roomNumber: room.roomNumber,
      size: room.size,
      equipment: room.equipment,
      price: room.price,
    });
    setOpenUpdateModal(true);
  };

  const handleUpdateRoom = async () => {
    await axios.put(`http://localhost:8080/api/rooms/update/${selectedRoomId}`, updateRoom);
    setOpenUpdateModal(false);
    fetchRooms(); // Rafraîchir la liste des chambres après la mise à jour
  };

  const handleUnassignResident = async (roomId) => {
    try {
      await axios.put(`http://localhost:8080/api/rooms/unassign/${roomId}`);
      fetchRooms(); // Rafraîchir la liste des chambres après la désassignation
    } catch (error) {
      console.error("Erreur lors de la désassignation du résident :", error);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "DISPONIBLE":
        return <Chip label="Disponible" color="success" />;
      case "OCCUPEE":
        return <Chip label="Occupée" color="error" />;
      default:
        return <Chip label="MAINTENANCE" color="default" />;
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <Typography variant="h4" sx={{ mb: 2, mt: 2 }}>
        Gérer les Chambres
      </Typography>
      <Box sx={{ display: "flex", gap: 2, margin: 3 }}>
        <TextField
          label="Rechercher par Numéro de Chambre"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreateModal(true)}
        >
          Créer une Chambre
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro de Chambre</TableCell>
              <TableCell>Taille</TableCell>
              <TableCell>Équipement</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Résident Assigné</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms
              .filter((room) =>
                room.roomNumber.toString().toLowerCase().includes(search.toLowerCase())
              )
              .map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.roomNumber}</TableCell>
                  <TableCell>{room.size} m</TableCell>
                  <TableCell>{room.equipment}</TableCell>
                  <TableCell>{room.price} DH/mois</TableCell>
                  <TableCell>{getStatusChip(room.status)}</TableCell>
                  <TableCell>
                    {room.residentId ? (
                      <>
                        <Chip label={getResidentName(room.residentId)} />
                        <Button
                          variant="outlined"
                          onClick={() => handleUnassignResident(room.id)}
                          style={{ marginLeft: "10px" }}
                        >
                          Désassigner
                        </Button>
                      </>
                    ) : (
                      "Aucun"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleAssignClick(room.id)}
                    >
                      Assigner Résident
                    </Button>
                    <RiDeleteBin5Line
                      variant="contained"
                      onClick={() => handleDeleteRoom(room.id)}
                      style={{ color: "red", marginLeft: "15px" }}
                    />
                     
                    <FaEdit
                      variant="contained"
                      onClick={() => handleUpdateClick(room)}
                      style={{ color: "green", marginLeft: "15px" }}
                   
                      />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal d'Assignation de Résident */}
      <Dialog open={openAssignModal} onClose={() => setOpenAssignModal(false)}>
        <DialogTitle>Assigner un Résident à la Chambre</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Sélectionner le Résident</InputLabel>
            <Select
              value={selectedResidentId}
              onChange={(e) => setSelectedResidentId(e.target.value)}
            >
              {residents.map((resident) => (
                <MenuItem key={resident.id} value={resident.id}>
                  {resident.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignModal(false)}>Annuler</Button>
          <Button onClick={handleAssignResident} variant="contained">
            Assigner
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Création de Chambre */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <DialogTitle>Créer une Nouvelle Chambre</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Numéro de Chambre"
            type="text"
            fullWidth
            value={newRoom.roomNumber}
            onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Taille"
            type="text"
            fullWidth
            value={newRoom.size}
            onChange={(e) => setNewRoom({ ...newRoom, size: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Équipement"
            type="text"
            fullWidth
            value={newRoom.equipment}
            onChange={(e) => setNewRoom({ ...newRoom, equipment: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Prix"
            type="number"
            fullWidth
            value={newRoom.price}
            onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>Annuler</Button>
          <Button onClick={handleCreateRoom} variant="contained">
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Mise à Jour de Chambre */}
      <Dialog open={openUpdateModal} onClose={() => setOpenUpdateModal(false)}>
        <DialogTitle>Mettre à Jour la Chambre</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Numéro de Chambre"
            type="text"
            fullWidth
            value={updateRoom.roomNumber}
            onChange={(e) => setUpdateRoom({ ...updateRoom, roomNumber: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Taille"
            type="text"
            fullWidth
            value={updateRoom.size}
            onChange={(e) => setUpdateRoom({ ...updateRoom, size: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Équipement"
            type="text"
            fullWidth
            value={updateRoom.equipment}
            onChange={(e) => setUpdateRoom({ ...updateRoom, equipment: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Prix"
            type="number"
            fullWidth
            value={updateRoom.price}
            onChange={(e) => setUpdateRoom({ ...updateRoom, price: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateModal(false)}>Annuler</Button>
          <Button onClick={handleUpdateRoom} variant="contained">
            Mettre à Jour
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoomList;
