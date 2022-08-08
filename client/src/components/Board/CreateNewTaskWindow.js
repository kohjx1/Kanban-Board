import React, { useState, useEffect } from "react"
// import Modal from "react-modal"
import { Collapse, Alert, Button, Select, OutlinedInput, ListItemText, Checkbox, InputLabel, MenuItem, FormControl, Grid, Modal, Box, TextField } from "@mui/material"
import Axios from "axios"

const CreateNewTaskWindow = ({ open, onClose }) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedPlans, setSelectedPlans] = useState("")
  const [app, setApp] = useState("")

  // to collect initial data
  const [plans, setPlans] = useState([])
  const [apps, setApps] = useState([])

  const resetValues = () => {
    setName("")
    setDescription("")
    setNotes("")
    setSelectedPlans("")
    setApp("")
  }

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    height: 700,
    bgcolor: "background.paper",
    backgroundColor: "#333",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
  }

  async function getPlans(e) {
    try {
      const response = await Axios.get("http://localhost:8080/getPlans")
      let tmp = []
      for (var i = 0; i < response.data.length; i++) {
        tmp.push(response.data[i].Plan_MVP_name)
      }
      setPlans(tmp)
    } catch (e) {
      console.log("There was a problem")
      return
    }
  }

  async function getApps(e) {
    try {
      const response = await Axios.get("http://localhost:8080/getApps")
      let tmp = []
      for (var i = 0; i < response.data.length; i++) {
        tmp.push(response.data[i].App_Acronym)
      }
      console.log(tmp)
      setApps(tmp)
    } catch (e) {
      console.log("There was a problem")
      return
    }
  }

  useEffect(() => {
    getPlans()
    getApps()
  }, [])

  async function addTask(e) {
    const response = await Axios.post("http://localhost:8080/getTaskID", { name: app })
    var id = response.data[0].App_Acronym + "_" + response.data[0].App_Rnumber
    console.log(id)
    if (response) {
      try {
        const response = await Axios.post("http://localhost:8080/createTask", { name: name, description: description, notes: notes, app: app, plan: selectedPlans, creator: sessionStorage.getItem("username"), id: id })
        resetValues()
      } catch (e) {
        console.log("There was a problem")
        return
      }
    }
  }

  const renderList = item => {
    return item.map(e => <MenuItem value={e}>{e}</MenuItem>)
  }

  console.log(selectedPlans)
  console.log(app)

  return (
    <Modal keepMounted open={open} onClose={onClose} aria-labelledby="keep-mounted-modal-title" aria-describedby="keep-mounted-modal-description">
      <Box sx={style}>
        <Grid container direction={"column"} spacing={2}>
          <Grid item>
            <h2 className="newTask">New Task</h2>
          </Grid>
          <Grid item>
            <TextField
              variant="filled"
              sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}
              value={name}
              label="Task Name"
              placeholder="Enter New Task Name"
              fullWidth
              required
              onChange={e => {
                setName(e.target.value)
              }}
              // error={fail ? true : false}
              // helperText={errors}
            />
          </Grid>

          <Grid item>
            <TextField
              variant="filled"
              sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}
              value={description}
              label="Description"
              placeholder="Enter Description"
              fullWidth
              required
              onChange={e => {
                setDescription(e.target.value)
              }}
              // error={fail ? true : false}
              // helperText={errors}
            />
          </Grid>

          <Grid item>
            <TextField
              variant="filled"
              sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}
              value={notes}
              label="Notes"
              placeholder="Enter Notes"
              fullWidth
              required
              onChange={e => {
                setNotes(e.target.value)
              }}
              // error={fail ? true : false}
              // helperText={errors}
            />
          </Grid>

          <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-simple-select-filled-label">Plan</InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={selectedPlans}
                onChange={e => {
                  setSelectedPlans(e.target.value)
                }}
              >
                {renderList(plans)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-simple-select-filled-label">Application</InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={app}
                onChange={e => {
                  setApp(e.target.value)
                }}
              >
                {renderList(apps)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <Button onClick={addTask} type="submit" color="primary" variant="contained" fullWidth>
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default CreateNewTaskWindow

// multi select
{
  /* <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-multiple-checkbox-label">Plan</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedPlans}
                onChange={event => {
                  const {
                    target: { value }
                  } = event
                  setSelectedPlans(
                    // On autofill we get a stringified value.
                    typeof value === "string" ? value.split(",") : value
                  )
                }}
                input={<OutlinedInput label="Tag" />}
                renderValue={selected => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {plans.map(name => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={selectedPlans.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */
}

{
  /* <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-multiple-checkbox-label">Application</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={app}
                onChange={event => {
                  const {
                    target: { value }
                  } = event
                  setApp(
                    // On autofill we get a stringified value.
                    typeof value === "string" ? value.split(",") : value
                  )
                }}
                input={<OutlinedInput label="Tag" />}
                renderValue={selected => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {apps.map(name => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={app.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */
}