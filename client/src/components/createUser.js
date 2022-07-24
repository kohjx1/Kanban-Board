import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Grid, Paper, Avatar, TextField, Button } from "@mui/material"
import KeyIcon from "@mui/icons-material/Key"
import Axios from "axios"

function Register() {
  const paperStyle = { padding: 20, height: "80vh", width: 280, margin: "20px auto" }
  const avatarStyle = { background: "green" }
  const inputStyle = { height: 80 }
  let navi = useNavigate

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setErrors] = useState("")

  const handleClickSuccess = () => {
    setEmail("")
    setUsername("")
    setPassword("")
    setErrors("")
  }

  async function addUser(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("http://localhost:8080/createUser", { username: username, email: email, password: password })

      const err = response.data.errors
      if (err) {
        setErrors(err)
      } else {
        handleClickSuccess()
      }

      return
    } catch (e) {
      console.log("There was a problem")
      return
    }
  }

  // function for capturing validation error message from backend
  const getError = (errors, prop) => {
    try {
      return errors.filter(e => e.param === prop)[0].msg
    } catch (error) {
      return ""
    }
  }

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <KeyIcon />
          </Avatar>
          <h2>Create New User</h2>
        </Grid>
        <TextField
          value={email}
          label="Email"
          placeholder="Enter Email"
          style={inputStyle}
          fullWidth
          required
          onChange={e => {
            setEmail(e.target.value)
          }}
          error={getError(error, "email") ? true : false}
          helperText={getError(error, "email")}
        />
        <h3></h3>
        <TextField
          value={username}
          label="Username"
          placeholder="Enter Username"
          style={inputStyle}
          fullWidth
          required
          onChange={e => {
            setUsername(e.target.value)
          }}
          error={getError(error, "username") ? true : false}
          helperText={getError(error, "username")}
        />
        <h3></h3>
        <TextField
          value={password}
          label="Password"
          placeholder="Enter Password"
          style={inputStyle}
          type="password"
          fullWidth
          required
          onChange={e => {
            setPassword(e.target.value)
          }}
          error={getError(error, "password") ? true : false}
          helperText={getError(error, "password")}
        />
        <h3></h3>
        <Button type="submit" color="primary" variant="contained" fullWidth onClick={addUser}>
          Create
        </Button>
      </Paper>
    </Grid>
  )
}

export default Register
