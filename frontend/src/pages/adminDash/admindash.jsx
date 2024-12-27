import React from 'react'
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin'
import { Container, Grid, Paper } from '@mui/material'
import styled from 'styled-components';
import CountUp from 'react-countup';

const admindash = () => {
  return (
    <div>
        <HeaderAdmin />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src="" alt="Students" />
                            <Title>
                              taux d’occupation
                            </Title>
                            <Data start={0} end={5000} duration={2.5} prefix="%" />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src="" alt="Classes" />
                            <Title>
                            paiements en retard
                            </Title>
                            <Data start={0} end={2000} duration={5} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src="" alt="Teachers" />
                            <Title>
                            incidents en cours
                            </Title>
                            <Data start={0} end={600} duration={2.5} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src="" alt="Fees" />
                            <Title>
                                total resident
                            </Title>
                            <Data start={0} end={230} duration={2.5}  />                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            no notifications
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
    </div>
  )
}

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


export default admindash
