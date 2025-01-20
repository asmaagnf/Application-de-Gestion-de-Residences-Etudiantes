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
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

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
    nomEtablissements: "",
    cin: "",
    role: "RESIDENT",
    password: "",
  });
  const [updateUser, setUpdateUser] = useState({
    username: "",
    contact: "",
    email: "",
    nomEtablissements: "",
    cin: "",
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
      console.error("Erreur lors de la récupération des résidents :", error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await axios.post("http://localhost:8080/api/users/register", newUser);
      setOpenCreateModal(false);
      setNewUser({ username: "", contact: "", email: "", nomEtablissements: "", cin: "", role: "RESIDENT", password: "" });
      fetchResidents();
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/delete/${userId}`);
      fetchResidents();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
    }
  };

  const handleUpdateClick = (user) => {
    setSelectedUserId(user.id);
    setUpdateUser({
      username: user.username,
      contact: user.contact,
      email: user.email,
      nomEtablissements: user.nomEtablissements,
      cin: user.cin,
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
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <Typography variant="h4" sx={{ mb: 2, mt: 2 }}>
        Gérer les Résidents
      </Typography>
      <Box sx={{ display: "flex", gap: 20, margin: 3 }}>
        <TextField
          label="Rechercher par Nom de Résident"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          className="button"
          onClick={() => setOpenCreateModal(true)}
        >
          Créer un Résident
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom du Résident</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Nom de l'Établissement</TableCell>
              <TableCell>CIN</TableCell>
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
                  <TableCell>{resident.nomEtablissements}</TableCell>
                  <TableCell>{resident.cin}</TableCell>
                  <TableCell>
                    <RiDeleteBin5Line
                      variant="contained"
                      onClick={() => handleDeleteUser(resident.id)}
                      style={{color: "red", marginLeft: "5px" }}
                    />
                      
                   <FaEdit
                      variant="contained"
                      onClick={() => handleUpdateClick(resident)}
                      style={{color: "green", marginLeft: "20px" }}
                    />
                      
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Création d'Utilisateur */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <DialogTitle>Créer un Nouvel Utilisateur</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nom du Résident"
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
            label="Nom de l'Établissement"
            type="text"
            fullWidth
            value={newUser.nomEtablissements}
            onChange={(e) => setNewUser({ ...newUser, nomEtablissements: e.target.value })}
          />
          <TextField
            margin="dense"
            label="CIN"
            type="text"
            fullWidth
            value={newUser.cin}
            onChange={(e) => setNewUser({ ...newUser, cin: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Mot de Passe"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>Annuler</Button>
          <Button onClick={handleCreateUser} variant="contained">
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Mise à Jour d'Utilisateur */}
      <Dialog open={openUpdateModal} onClose={() => setOpenUpdateModal(false)}>
        <DialogTitle>Mettre à Jour le Résident</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nom d'utilisateur"
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
            label="Nom de l'Établissement"
            type="text"
            fullWidth
            value={updateUser.nomEtablissements}
            onChange={(e) => setUpdateUser({ ...updateUser, nomEtablissements: e.target.value })}
          />
          <TextField
            margin="dense"
            label="CIN"
            type="text"
            fullWidth
            value={updateUser.cin}
            onChange={(e) => setUpdateUser({ ...updateUser, cin: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Mot de Passe"
            type="password"
            fullWidth
            placeholder="Laissez vide pour garder le mot de passe actuel"
            value={updateUser.password}
            onChange={(e) => setUpdateUser({ ...updateUser, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateModal(false)}>Annuler</Button>
          <Button onClick={handleUpdateUser} variant="contained">
            Mettre à Jour
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResidentList;
