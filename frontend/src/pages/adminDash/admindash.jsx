import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';
import { Container, Grid, Paper, CircularProgress, Typography } from '@mui/material';
import styled from 'styled-components';
import CountUp from 'react-countup';
import axios from 'axios';
import StatisticsChart from '../../components/StatisticsChart'; // Import the chart component

const AdminDash = () => {
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [totaloccupancy, settotaloccupancy] = useState(0);
  const [overduePayments, setOverduePayments] = useState(0);
  const [ongoingIncidents, setOngoingIncidents] = useState(0);
  const [totalResidents, setTotalResidents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const occupancyResponse = await axios.get('http://localhost:8080/api/statistics/occupancy-rate');
        const overdueResponse = await axios.get('http://localhost:8080/api/statistics/overdue-payments');
        const incidentsResponse = await axios.get('http://localhost:8080/api/statistics/ongoing-incidents');
        const occupancytotalResponse = await axios.get('http://localhost:8080/api/statistics/total-occupancy');
        const residentsResponse = await axios.get('http://localhost:8080/api/statistics/total-residents'); 

        setOccupancyRate(occupancyResponse.data);
        setOverduePayments(overdueResponse.data);
        settotaloccupancy(occupancytotalResponse.data)
        setOngoingIncidents(incidentsResponse.data);
        setTotalResidents(residentsResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography color="error">Erreur lors du chargement des données: {error}</Typography>
      </Container>
    );
  }

  return (
    <div>
      <HeaderAdmin />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src="" alt="" />
              <Title>Taux d’Occupation</Title>
              <Data start={0} end={occupancyRate} duration={2.5} prefix="%" />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src="" alt="" />
              <Title>Total d’Occupation</Title>
              <Data start={0} end={totaloccupancy} duration={2.5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src="" alt="" />
              <Title>Paiements en Retard</Title>
              <Data start={0} end={overduePayments} duration={5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src="" alt="" />
              <Title>Incidents en Cours</Title>
              <Data start={0} end={ongoingIncidents} duration={2.5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src="" alt="" />
              <Title>Total Résidents</Title>
              <Data start={0} end={totalResidents} duration={2.5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <StatisticsChart 
              totaloccupancy={totaloccupancy}
              overduePayments={overduePayments}
              ongoingIncidents={ongoingIncidents}
              totalResidents={totalResidents}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography>No notifications</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + .6vw);
  color: green;
`;

export default AdminDash;
