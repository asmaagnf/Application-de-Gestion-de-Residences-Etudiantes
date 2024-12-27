import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import axios from "axios";
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin'

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
    fetchRooms(); // Refresh room list after assignment
  };

  const getResidentName = (residentId) => {
    const resident = residents.find((r) => r.id === residentId);
    return resident ? resident.username : "Unknown";
  };

  const handleCreateRoom = async () => {
    await axios.post("http://localhost:8080/api/rooms/create", newRoom);
    setOpenCreateModal(false);
    setNewRoom({ roomNumber: "", size: "", equipment: "", price: "" });
    fetchRooms(); // Refresh room list after creation
  };

  const handleDeleteRoom = async (roomId) => {
    await axios.delete(`http://localhost:8080/api/rooms/delete/${roomId}`);
    fetchRooms(); // Refresh room list after deletion
  };

  const handleUpdateClick = (room) => {
    setSelectedRoomId(room.id);
    setUpdateRoom({
      roomNumber: room.roomNumber,
      size: room.size,
      equipment: room.equipment,
      price: room.price,
      status: room.status
    });
    setOpenUpdateModal(true);
  };

  const handleUpdateRoom = async () => {
    await axios.put(`http://localhost:8080/api/rooms/update/${selectedRoomId}`, updateRoom);
    setOpenUpdateModal(false);
    fetchRooms(); // Refresh room list after update
  };

  const handleUnassignResident = async (roomId) => {
    try {
      await axios.put(`http://localhost:8080/api/rooms/unassign/${roomId}`);
      fetchRooms(); // Refresh room list after unassignment
    } catch (error) {
      console.error("Error unassigning resident:", error);
    }
  };

  return (
    <div >
      <HeaderAdmin />
      <Typography variant="h4" sx={{ mb: 2, mt:2 }}>
        Manage Rooms
      </Typography>
      <Box sx={{  display: "flex", gap: 2, margin:3 }}>
        <TextField
          label="Search by Room Number"
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
        Create Room
      </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room Number</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Equipment</TableCell>
              <TableCell>price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned Resident</TableCell>
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
                <TableCell>{room.size}m</TableCell>
                <TableCell>{room.equipment}</TableCell>
                <TableCell>{room.price} DH/mois</TableCell>
                <TableCell>{room.status}</TableCell>
                <TableCell>
                {room.residentId ? (
                <>
                {getResidentName(room.residentId)}
               <Button
               variant="outlined"
               onClick={() => handleUnassignResident(room.id)}
              style={{ marginLeft: "10px" }}
               >
               Unassign
              </Button>
              </>
              ) : (
             "None"
             )}
            </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    
                    onClick={() => handleAssignClick(room.id)}
                  >
                    Assign Resident
                  </Button>
                  <Button
                    variant="contained"
                    
                    onClick={() => handleDeleteRoom(room.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                   
                    onClick={() => handleUpdateClick(room)}
                    style={{ marginLeft: "10px" }}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Assign Resident Modal */}
      <Dialog open={openAssignModal} onClose={() => setOpenAssignModal(false)}>
        <DialogTitle>Assign Resident to Room</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Select Resident</InputLabel>
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
          <Button onClick={() => setOpenAssignModal(false)}>Cancel</Button>
          <Button onClick={handleAssignResident} variant="contained" >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Room Modal */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <DialogTitle>Create New Room</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Room Number"
            type="text"
            fullWidth
            value={newRoom.roomNumber}
            onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Size"
            type="text"
            fullWidth
            value={newRoom.size}
            onChange={(e) => setNewRoom({ ...newRoom, size: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Equipment"
            type="text"
            fullWidth
            value={newRoom.equipment}
            onChange={(e) => setNewRoom({ ...newRoom, equipment: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={newRoom.price}
            onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
          <Button onClick={handleCreateRoom} variant="contained" >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Room Modal */}
      <Dialog open={openUpdateModal} onClose={() => setOpenUpdateModal(false)}>
        <DialogTitle>Update Room</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Room Number"
            type="text"
            fullWidth
            value={updateRoom.roomNumber}
            onChange={(e) => setUpdateRoom({ ...updateRoom, roomNumber: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Size"
            type="text"
            fullWidth
            value={updateRoom.size}
            onChange={(e) => setUpdateRoom({ ...updateRoom, size: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Equipment"
            type="text"
            fullWidth
            value={updateRoom.equipment}
            onChange={(e) => setUpdateRoom({ ...updateRoom, equipment: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={updateRoom.price}
            onChange={(e) => setUpdateRoom({ ...updateRoom, price: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateModal(false)}>Cancel</Button>
          <Button onClick={handleUpdateRoom} variant="contained" >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoomList;
