import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button } from '@mui/material';
import styled from 'styled-components';
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';

const Homepage = () => {
    return (
        <StyledContainer>
            <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                    <img src={Students} alt="étudiants" style={{ width: '100%' }} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <StyledPaper elevation={3}>
                        <StyledTitle>
                            Bienvenue à
                            <br />
                            l'Application de
                            <br />
                            Gestion des Résidences Étudiantes
                        </StyledTitle>
                        <StyledText>
                            Gérez facilement votre expérience de résidence ! 
                            Consultez vos informations de chambre, soumettez des requêtes de maintenance, et accédez à vos paiements.
                            Restez informé des annonces et événements importants.
                        </StyledText>
                        
                        <StyledBox>
                            <div>
                                <StyledLink to="/login">
                                    <LightPurpleButton variant="contained" fullWidth>
                                        Connexion
                                    </LightPurpleButton>
                                </StyledLink>
                                <StyledLink to="/register">
                                    <Button variant="outlined" fullWidth
                                        sx={{ mt: 2, mb: 3, color: "#7f56da", borderColor: "#7f56da" }}
                                    >
                                        Inscription
                                    </Button>
                                </StyledLink>
                            </div>
                            <StyledText>
                                Vous n'avez pas de compte ?{' '}
                                <Link to="/register" style={{color:"#550080"}}>
                                    Inscrivez-vous
                                </Link>
                            </StyledText>
                        </StyledBox>
                    </StyledPaper>
                </Grid>
            </Grid>
        </StyledContainer>
    );
};

export default Homepage;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledPaper = styled.div`
  padding: 24px;
  height: 100vh;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
`;

const StyledTitle = styled.h1`
  font-size: 3rem;
  color: #252525;
  font-weight: bold;
  padding-top: 0;
  letter-spacing: normal;
  line-height: normal;
`;

const StyledText = styled.p`
  margin-top: 30px;
  margin-bottom: 30px; 
  letter-spacing: normal;
  line-height: normal;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;
