import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { FormControl, TextField, Grid, Button, Box } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ActionCreators from '../../actions';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

const LocationModalButton = () => {
  const [locationData, setLocationData] = React.useState({
    name: '',
    address: '',
    zip_code: '',
    city: '',
    coordinates: {
      latitude: 0.0,
      longitude: 0.0
    }
  });

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();
  const locationSubmitHandler = event => {
    const locationFormData = {
      name: locationData.name,
      address: locationData.address,
      zip_code: locationData.zip_code,
      city: locationData.city,
      coordinates: {
        type: 'Point',
        coordinates: [
          parseFloat(locationData.coordinates.latitude),
          parseFloat(locationData.coordinates.longitude)
        ]
      }
    };
    dispatch(ActionCreators.createLocation(locationFormData));
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton size="small" onClick={() => setOpen(true)}>
        <AddIcon />
      </IconButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div
          style={{
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -30%)'
          }}
          className={classes.paper}
        >
          <h2>Add new location</h2>
          <form>
            <FormControl fullWidth>
              <TextField
                required
                label="Name"
                margin="dense"
                variant="outlined"
                onChange={event =>
                  setLocationData({ ...locationData, name: event.target.value })
                }
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Address"
                margin="dense"
                variant="outlined"
                onChange={event =>
                  setLocationData({
                    ...locationData,
                    address: event.target.value
                  })
                }
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Zip code"
                margin="dense"
                variant="outlined"
                onChange={event =>
                  setLocationData({
                    ...locationData,
                    zip_code: event.target.value
                  })
                }
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="City"
                margin="dense"
                variant="outlined"
                onChange={event =>
                  setLocationData({ ...locationData, city: event.target.value })
                }
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Latitude"
                margin="dense"
                variant="outlined"
                onChange={event =>
                  setLocationData({
                    ...locationData,
                    coordinates: {
                      ...locationData.coordinates,
                      longitude: event.target.value
                    }
                  })
                }
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Longitude"
                margin="dense"
                variant="outlined"
                onChange={event =>
                  setLocationData({
                    ...locationData,
                    coordinates: {
                      ...locationData.coordinates,
                      latitude: event.target.value
                    }
                  })
                }
              />
            </FormControl>

            <Box mt={5}>
              <Grid container justify="flex-end">
                <Grid item>
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button
                    disabled={!locationData.name}
                    variant="contained"
                    color="primary"
                    type="button"
                    onClick={locationSubmitHandler}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default LocationModalButton;
