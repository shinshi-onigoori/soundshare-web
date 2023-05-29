import React, { useState } from 'react';
import {
    Box,
    Button,
    Grid,
    Link,
    TextField,
} from '@mui/material';
import { useRouter } from "next/router";
import {API_HOST} from '../util/common';

const apiHost = API_HOST;

const Register = () => {
    const [userIdAlert, setUserIdAlert] = useState("");
    const router = useRouter();
    // TODO firestore使って会員データ保持機構作成
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const postBody = {
            id: data.get('userId'),
            userName: data.get('userName'),
            password: data.get('password'),
        };
        const response = await fetch(apiHost + '/users', {
            method: 'POST',
            body: JSON.stringify(postBody),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        }).then((respons) => respons);
        if (response.status == 200){
            router.push('/')
            setUserIdAlert("")
        }else if(response.status == 409){
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
                                id='userName'
                                label='User Name'
                                name='userName'
                            />
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
                        Sign Up
                    </Button>
                    <Grid container justifyContent='flex-end'>
                        <Grid item>
                            <Link href='/' variant='body2'>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </div>
    );
};

export default Register;