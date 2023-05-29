import React, { useState, useContext } from 'react';
import {
    Box,
    Button,
    Grid,
    Link,
    TextField,
} from '@mui/material';
import { useRouter } from "next/router";
import {API_HOST} from '../util/common';
import { UserContext } from '../context/sessionContext';

const apiHost = API_HOST;

const LogIn = () => {
    const userContext = useContext(UserContext);
    const [userIdAlert, setUserIdAlert] = useState("");
    const router = useRouter();
    // TODO firestore使って会員データ保持機構作成
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const userId = data.get('userId');
        const password = data.get('password');
        const response = await fetch(`${apiHost}/users/${userId}`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'User-Id': userId,
                'User-Password': password
            }),
        }).then((respons) => respons);
        if (response.status == 200){
            const res_body = await response.json()
            userContext.setUserId(userId)
            userContext.setUserName(password)
            userContext.setUserPassword(res_body.userName)
            router.push('/search')
            setUserIdAlert("")
        }else if(response.status == 403 || response.status == 404){
            const res_body = await response.json()
            setUserIdAlert(res_body.description)
        }
    };

    return (
        <div className='card'>
            <div className='cardContents'>
                <Box
                    component='form'
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 3 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id='userId'
                                label='User ID'
                                name='userId'
                            />
                            <p className='signUpFormAlert'>{userIdAlert}</p>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name='password'
                                label='Password'
                                type='password'
                                id='password'
                                autoComplete='new-password'
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container justifyContent='flex-end'>
                        <Grid item>
                            <Link href='/register' variant='body2'>
                                Have no account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </div>
    );
};

export default LogIn;