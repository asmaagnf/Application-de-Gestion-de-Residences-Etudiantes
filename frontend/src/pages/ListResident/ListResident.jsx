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
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';

const ResidentList = () => {
  const [residents, setResidents] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [search, setSearch] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    contact: "",
    email: "",
    role: "RESIDENT",
    password: "",
  });
  const [updateUser, setUpdateUser] = useState({
    username: "",
    contact: "",
    email: "",
    role: "RESIDENT",
    password: "",

  });

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/list");
      setResidents(response.data);
    } catch (error) {
      console.error("Error fetching residents:", error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await axios.post("http://localhost:8080/api/users/register", newUser);
      setOpenCreateModal(false);
      setNewUser({ username: "", contact: "", email: "", role: "RESIDENT", password: "" });
      fetchResidents();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/delete/${userId}`);
      fetchResidents();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateClick = (user) => {
    setSelectedUserId(user.id);
    setUpdateUser({
      username: user.username,
      contact: user.contact,
      email: user.email,
      role: user.role || "RESIDENT",
      password: user.password,
    });
    setOpenUpdateModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`http://localhost:8080/api/users/update/${selectedUserId}`, updateUser);
      setOpenUpdateModal(false);
      fetchResidents();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <Typography variant="h4" sx={{ mb: 2, mt: 2 }}>
        Manage Residents
      </Typography>
      <Box sx={{ display: "flex", gap: 2, margin: 3 }}>
        <TextField
          label="Search by Resident Name"
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
          Create Resident
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Resident Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {residents
              .filter((resident) =>
                resident.username.toLowerCase().includes(search.toLowerCase())
              )
              .map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell>{resident.username}</TableCell>
                  <TableCell>{resident.contact}</TableCell>
                  <TableCell>{resident.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleDeleteUser(resident.id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateClick(resident)}
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

      {/* Create User Modal */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Resident Name"
            type="text"
            fullWidth
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Contact"
            type="text"
            fullWidth
            value={newUser.contact}
            onChange={(e) => setNewUser({ ...newUser, contact: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={updateUser.password}
            onChange={(e) => setUpdateUser({ ...updateUser, password: e.target.value })}
           />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update User Modal */}
      <Dialog open={openUpdateModal} onClose={() => setOpenUpdateModal(false)}>
        <DialogTitle>Update Resident</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={updateUser.username}
            onChange={(e) => setUpdateUser({ ...updateUser, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Contact"
            type="text"
            fullWidth
            value={updateUser.contact}
            onChange={(e) => setUpdateUser({ ...updateUser, contact: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            value={updateUser.email}
            onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
          />
           <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            placeholder="Leave empty to keep the current password"
            value={updateUser.password}
            onChange={(e) => setUpdateUser({ ...updateUser, password: e.target.value })}
           />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateModal(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResidentList;
