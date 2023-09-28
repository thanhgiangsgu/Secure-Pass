import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'


const initialState = {
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
}

const Register = () => {
    const defaultTheme = createTheme();

    const [user, setUser] = useState(initialState)
    const [open, setOpen] = useState(true)
    const { email, name, password, confirmPassword, phoneNumber } = user
    const navigate = useNavigate()

    const handleChangeInput = e => {
        const { name, value } = e.targer
        setUser({ ...user, [name]: value, err: '', success: '' })
        console.log(user);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (user.email == "" || user.name == "" || user.password == "" || user.confirmPassword == "" || user.phoneNumber == "") {
            toast.error("Bạn vui lòng nhập đầy đủ thông tin")
        } else {
            if (user.password != user.confirmPassword) {
                toast.error("Mật khẩu không khớp")
            } else {
                const res = await axios.post(`http://localhost:3001/user/check-email/${user.email}`)
                if (res.data.check == "false") {
                    const dataUser = {
                        email: user.email,
                        name: user.name,
                        password: user.password,
                        phoneNumber: user.phoneNumber,
                    }
                    axios.post("http://localhost:3001/user/add-user", dataUser)
                    toast.success("Thêm thành công !", {
                        position: 'top-right'
                    })
                } else {
                    toast.error("Địa chỉ email đã tồn tại")
                }

            }
        }
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="#" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default Register