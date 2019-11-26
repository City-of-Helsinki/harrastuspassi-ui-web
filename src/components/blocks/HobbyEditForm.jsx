import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  FormControl,
  TextField,
  Button,
  Grid,
  Select,
  InputLabel,
  MenuItem,
  Box,
  Input,
  Chip,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import OrganizerModalButton from './OrganizerModalButton';
import LocationModalButton from './LocationModalButton';
import HobbyEventModalButton from './HobbyEventModalButton';
import HobbyEventItem from './HobbyEventItem';
import ActionCreators from '../../actions';
import { useDeepCompareEffect } from '../../hooks';
import { isNumber, isString } from 'util';
import { updateHobbyEvent } from '../../actions/hobbyActions';

const HobbyEditForm = ({ cancelUrl }) => {
  const categoryState = useSelector(state => state.categories);
  const organizerState = useSelector(state => state.organizers);
  const locationState = useSelector(state => state.locations);
  const formState = useSelector(state => state.formData);
  const history = useHistory();
  const locationID = formState.hobby.location;

  const [hobbyEventData, setHobbyEventData] = React.useState([]);

  const dispatch = useDispatch();
  const handleChange = event => {
    switch (event.target.name) {
      case 'cover_image':
        const reader = new FileReader();
        const name = event.target.name;
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
          const image = reader.result;
          dispatch(ActionCreators.setFormData(name, image));
        };
        reader.onerror = () => {
          window.alert('Kuvan käsittelyssä tapahtui virhe!');
        };
        break;
      default:
        dispatch(
          ActionCreators.setFormData(event.target.name, event.target.value)
        );
    }
  };

  const handleRemoveEvent = id => {
    console.log(id);
    const filteredEvents = formState.hobbyEvents.filter(item => item.id !== id);
    if (isNumber(id)) {
      dispatch(ActionCreators.setRemovedEvents(id));
    }
    dispatch(ActionCreators.removeHobbyEvent(filteredEvents));
  };

  const handleNewEvent = data => {
    setHobbyEventData([data, ...hobbyEventData]);
  };

  const categoryListItems = categoryState.categories.map((category, index) => (
    <MenuItem value={category.id} key={index}>
      {category.name}
    </MenuItem>
  ));
  const locationListItems = locationState.locations.map((location, index) => (
    <MenuItem value={location.id} key={index}>
      {location.name}
    </MenuItem>
  ));
  const organizerListItems = organizerState.organizers.map(
    (organizer, index) => (
      <MenuItem value={organizer.id} key={index}>
        {organizer.name}
      </MenuItem>
    )
  );
  const hobbyEventItems = formState.hobbyEvents.map((hobbyEvent, index) => (
    <HobbyEventItem
      data={hobbyEvent}
      key={index}
      handleRemoveEvent={() => handleRemoveEvent(hobbyEvent.id)}
    />
  ));

  const useStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing.unit
    },
    leftIcon: {
      marginRight: theme.spacing.unit
    }
  }));

  const classes = useStyles();

  const submitHandler = event => {
    event.preventDefault();

    const postedHobby = { ...formState.hobby };
    if (
      postedHobby.cover_image === null ||
      postedHobby.cover_image.length < 300
    ) {
      delete postedHobby.cover_image;
    }

    dispatch(ActionCreators.updateHobby(formState.hobby.id, postedHobby));
    const postedEvents = [...formState.hobbyEvents];
    postedEvents.forEach((item, index) => {
      for (const key in item) {
        if (key === 'start_date' || key === 'end_date') {
          postedEvents[index] = {
            ...postedEvents[index],
            [key]: item[key].format('YYYY-MM-DD')
          };
        } else if (key === 'start_time' || key === 'end_time') {
          postedEvents[index] = {
            ...postedEvents[index],
            [key]: item[key].format('HH:mm')
          };
        }
      }
      if (isNumber(item.id)) {
        console.log('No hobbies to edit');
      } else {
        dispatch(
          ActionCreators.createHobbyEvent({
            ...postedEvents[index],
            hobby: formState.hobby.id
          })
        );
      }
    });
    formState.removedEvents.forEach(item => {
      dispatch(ActionCreators.deleteHobbyEvent(item));
    });
    history.push('/');
  };

  useDeepCompareEffect(() => {
    const postedEvents = [...formState.hobbyEvents];
    console.log('DEEPCOMPARE EFFECT: ', formState.hobbyQueryState);
    if (formState.hobby.id) {
      console.log('INSIDE IF NAO');
      postedEvents.forEach((object, index) => {
        for (const key in object) {
          if (key === 'start_date' || key === 'end_date') {
            postedEvents[index] = {
              ...postedEvents[index],
              [key]: object[key].format('YYYY-MM-DD')
            };
          } else if (key === 'start_time' || key === 'end_time') {
            postedEvents[index] = {
              ...postedEvents[index],
              [key]: object[key].format('HH:mm')
            };
          }
        }
        dispatch(
          ActionCreators.createHobbyEvent({
            ...postedEvents[index],
            hobby: formState.hobby.id
          })
        );
      });
    }
  }, [formState.hobby.id]);

  return (
    <form onSubmit={submitHandler}>
      <Box mt={4}>
        <FormControl fullWidth>
          <TextField
            id="name"
            name="name"
            value={formState.hobby.name || ''}
            placeholder={''}
            required
            label=""
            margin="dense"
            variant="outlined"
            onChange={handleChange}
          />
        </FormControl>
      </Box>

      <Box mt={4} style={{ display: 'inline-flex' }} width={1}>
        <div style={{ width: '100%' }}>
          <FormControl fullWidth>
            <InputLabel>Vaihda sijainti</InputLabel>
            <Select
              id="location"
              name="location"
              value={locationID || 0}
              onChange={handleChange}
            >
              {locationListItems}
            </Select>
          </FormControl>
        </div>
        <LocationModalButton />
      </Box>

      <Box mt={4}>
        <FormControl fullWidth>
          <input
            accept="image/*"
            id="image"
            name="cover_image"
            type="file"
            style={{ display: 'none' }}
            onChange={handleChange}
          />
          <label htmlFor="image">
            <div style={{ display: 'inline-flex' }}>
              <Button
                variant="contained"
                component="span"
                color="primary"
                className={classes.button}
              >
                <ImageSearchIcon className={classes.leftIcon} />
                Valitse kuva
              </Button>
              <p>{formState.hobby.cover_image ? 'Kuva valittu' : 'Ei kuvaa'}</p>
            </div>
          </label>
        </FormControl>
      </Box>

      <Box mt={4}>
        <FormControl fullWidth>
          <TextField
            id="description"
            name="description"
            label=""
            value={formState.hobby.description || ''}
            margin="dense"
            variant="outlined"
            onChange={handleChange}
          />
        </FormControl>
      </Box>

      <Box mt={4} style={{ display: 'inline-flex' }} width={1}>
        <div style={{ width: '100%' }}>
          <FormControl fullWidth>
            <InputLabel>Vaihda järjestäjä</InputLabel>
            <Select
              id="organizer"
              name="organizer"
              value={formState.hobby.organizer || 0}
              onChange={handleChange}
            >
              {organizerListItems}
            </Select>
          </FormControl>
        </div>
        <OrganizerModalButton />
      </Box>

      <Box mt={4}>
        <FormControl fullWidth>
          <InputLabel htmlFor="select-multiple-chip">Kategoriat</InputLabel>
          <Select
            multiple
            name="categories"
            value={formState.hobby.categories || []}
            onChange={handleChange}
            input={<Input id="select-multiple-chip" />}
            inputProps={{
              name: 'categories',
              id: 'category-simple'
            }}
            renderValue={selected => (
              <div>
                {selected.map(value => (
                  <Chip
                    key={value}
                    label={
                      categoryState.categories.find(o => o.id === value).name
                    }
                  />
                ))}
              </div>
            )}
          >
            {categoryListItems}
          </Select>
        </FormControl>
      </Box>

      <Box mt={4}>
        <Grid container justify="space-between">
          <Grid item>
            <Typography variant="h4">Tapahtumat</Typography>
          </Grid>
          <Grid item>
            <HobbyEventModalButton handleNewEvent={handleNewEvent} />
          </Grid>
        </Grid>
      </Box>

      {hobbyEventItems}

      <Box mt={3} mb={3}>
        <Grid container justify="flex-end">
          <Grid item>
            <Button component={Link} to={cancelUrl}>
              Peruuta
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Tallenna
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default HobbyEditForm;