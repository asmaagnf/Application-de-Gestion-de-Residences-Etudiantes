import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import HeaderResident from '../../components/HeaderResident/HeaderResident';
import { MdOutlineMail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";


const ResidentProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [nomEtablissements, setNomEtablissements] = useState("");
  const [cin, setCin] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        setUser(response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setContact(response.data.contact);
        setNomEtablissements(response.data.nomEtablissements); // Added field
        setCin(response.data.cin); // Added field
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const updatedUser = {
        username,
        email,
        contact,
        nomEtablissements, // Added field
        cin, // Added field
      };

      await axios.put(`http://localhost:8080/api/users/update/${userId}`, updatedUser);

      setIsEditModalOpen(false);
      toast.success("Modifié avec succès !");
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      await axios.put(`http://localhost:8080/api/users/updatePassword/${userId}`, {
        password,
        newPassword,
      });

      setIsPasswordModalOpen(false);
      toast.success("Mot de passe modifié avec succès !");
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      await axios.delete(`http://localhost:8080/api/users/delete/${userId}`);

      toast.success("Utilisateur supprimé avec succès !");
      handleLogout();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <HeaderResident />
      <div style={styles.pageContainer}>
        <div style={styles.accountPage}>
          <div style={styles.accountSidebar}>
            <h2 style={styles.sidebarTitle}>Votre Compte</h2>
            <ul style={styles.sidebarList}>
              <li style={{marginBottom:'50px'}}>
                <a href="#profile" style={styles.sidebarLink}>Profil</a>
              </li>
              <li style={{marginBottom:'50px'}}>
                <a href="#password" style={styles.sidebarLink} onClick={() => setIsPasswordModalOpen(true)}>Changer Password</a>
              </li>
              <li >
                <a href="#delete-account" style={styles.sidebarLink} onClick={handleDeleteUser}>Supprimer Compte</a>
              </li>
            </ul>
          </div>
          <div style={styles.accountContent}>
            <div style={styles.accountHeader}>
              <h2>Compte</h2>
              <button style={styles.editButton} onClick={() => setIsEditModalOpen(true)}>Modifier</button>
            </div>
            <div style={styles.accountInfo}>
              <div style={styles.accountDetails}>
                <p style={{marginBottom:'20px'}}><FaRegUser />  {user.username}</p>
                <p style={{marginBottom:'20px'}}><MdOutlineMail />  {user.email}</p>
                <p style={{marginBottom:'20px'}}><b>Contact:</b> {user.contact}</p>
                <p style={{marginBottom:'20px'}}><b>Nom de l'Établissement:</b> {user.nomEtablissements}</p> {/* Display new field */}
                <p style={{marginBottom:'20px'}}><b>CIN:</b> {user.cin}</p> {/* Display new field */}
              </div>
            </div>
            <button style={styles.logoutButton} onClick={handleLogout}>Se Déconnecter</button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <DialogTitle>Modifier vos informations</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nom de l'Établissement"
            value={nomEtablissements}
            onChange={(e) => setNomEtablissements(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="CIN"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditModalOpen(false)}>Annuler</Button>
          <Button onClick={handleEditUser} color="primary">Modifier</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)}>
        <DialogTitle>Changer Mot de Passe</DialogTitle>
        <DialogContent>
          <TextField
            label="Mot de passe actuel"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nouveau mot de passe"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPasswordModalOpen(false)}>Annuler</Button>
          <Button onClick={handleChangePassword} color="primary">Changer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


const styles = {
  
    pageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
    },
    accountPage: {
      display: 'flex',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
      width: '80%',
      maxWidth: '900px',
    },
    accountSidebar: {
      width: '200px',
      padding: '20px',
      borderRight: '1px solid #ccc',
    },
    sidebarTitle: {
      marginBottom: '20px',
    },
    sidebarList: {
      listStyle: 'none',
      padding: '0',
    },
    sidebarLink: {
      display: 'block',
      marginBottom: '10px',
      textDecoration: 'none',
      color: '#333',
    },
    accountContent: {
      flex: '1',
      padding: '20px',
    },
    accountHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    editButton: {
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      padding: '5px 10px',
      cursor: 'pointer',
    },
    accountInfo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
    },
   
   
    accountDetails: {
      p: {
        marginBottom:'20px',
      },
    },
    logoutButton: {
      backgroundColor: '#ff4d4d',
      border: 'none',
      color: '#fff',
      padding: '10px 20px',
      cursor: 'pointer',
    },
    logoutButtonHover: {
      backgroundColor: '#ff1a1a',
    },

};

export default ResidentProfile;
