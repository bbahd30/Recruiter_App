
import React from 'react';
import { Grid, Paper, Button } from '@mui/material';
import * as Links from "../Links";

const Login = () => {

    const BoxStyle = {
        height: '45vh',
        width: '40vw',
        padding: 20,
        margin: '20vh auto',
    }
    return (
        <div>
            <Grid>
                <Paper elevation= {3} style = {BoxStyle}>
                    <Grid style={{position: 'relative', top: '110px'}}>
                        
                        <Grid item>
                            <h2>Welcome to Recruiter</h2> 
                        </Grid>
                        <Grid item>
                            <form >
                                <a href={Links.login_link} style={{textDecoration: "none"}}>
                                    <Button style=  {{
                                        borderRadius: 35,
                                        backgroundColor: "#21b6ae",
                                        padding: "18px 36px",
                                        fontSize: "18px"
                                    }}variant="contained">
                                        Sign in using Omniport
                                    </Button>
                                </a>
                            </form>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </div>
    );
};

export default Login;