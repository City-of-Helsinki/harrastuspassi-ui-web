import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {
  FormControl,
  Grid,
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import ActionCreators from '../../actions';
import { useActions } from '../../hooks';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

const HobbyEventModalButton = ({ handleNewEvent }) => {
  const actions = useActions(ActionCreators);
  const initialState = {
    start_date: null,
    end_date: null,
    start_time: null,
    end_time: null,
    id:
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
  };
  const [hobbyEventData, setHobbyEventData] = React.useState(initialState);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleSave = () => {
    handleNewEvent(hobbyEventData);
    setHobbyEventData(initialState);
    actions.setHobbyEventsFormData(hobbyEventData);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        component="span"
        color="primary"
        onClick={() => setOpen(true)}
      >
        Uusi tapahtuma
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div
          style={{
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -30%)'
          }}
          className={classes.paper}
        >
          <h2>Lisää uusi tapahtuma</h2>
          <form>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Grid
                container
                direction="row"
                justify="space-around"
                alignItems="center"
                spacing={3}
              >
                <Grid item>
                  <FormControl>
                    <KeyboardDatePicker
                      disableToolbar
                      autoOk={true}
                      variant="inline"
                      format="DD.MM.YYYY"
                      margin="normal"
                      id="start_date"
                      label="Start date"
                      value={hobbyEventData.start_date}
                      onChange={date =>
                        setHobbyEventData({
                          ...hobbyEventData,
                          start_date: date
                        })
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <KeyboardDatePicker
                      disableToolbar
                      autoOk={true}
                      variant="inline"
                      format="DD.MM.YYYY"
                      margin="normal"
                      id="date-picker-inline"
                      label="End date"
                      value={hobbyEventData.end_date}
                      onChange={date =>
                        setHobbyEventData({ ...hobbyEventData, end_date: date })
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Grid
                container
                direction="row"
                justify="space-around"
                alignItems="center"
                spacing={3}
              >
                <Grid item>
                  <FormControl>
                    <KeyboardTimePicker
                      autoOk={true}
                      disableToolbar
                      ampm={false}
                      variant="inline"
                      margin="normal"
                      label="Start time"
                      value={hobbyEventData.start_time}
                      onChange={time =>
                        setHobbyEventData({
                          ...hobbyEventData,
                          start_time: time
                        })
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <KeyboardTimePicker
                      autoOk={true}
                      disableToolbar
                      ampm={false}
                      variant="inline"
                      margin="normal"
                      label="End time"
                      value={hobbyEventData.end_time}
                      onChange={time =>
                        setHobbyEventData({ ...hobbyEventData, end_time: time })
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid>
                <Grid item>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={hobbyEventData.is_recurrent}
                          onChange={e => {
                            setHobbyEventData({
                              ...hobbyEventData,
                              is_recurrent: e.target.checked ? 1 : 0
                            });
                          }}
                          name="checkedA"
                        />
                      }
                      label="Toistuu viikoittain"
                    />
                    <FormControlLabel
                      control={
                        <TextField
                          value={hobbyEventData.recurrency_count}
                          onChange={e => {
                            setHobbyEventData({
                              ...hobbyEventData,
                              recurrency_count: Number(e.target.value)
                            });
                          }}
                          type="number"
                          size="small"
                          style={{ width: 50 }}
                        />
                      }
                      label="viikon ajan"
                    />
                  </FormGroup>
                </Grid>
              </Grid>

              <Box mt={5}>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                      variant="contained"
                      color="primary"
                      type="button"
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </MuiPickersUtilsProvider>
          </form>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default HobbyEventModalButton;
