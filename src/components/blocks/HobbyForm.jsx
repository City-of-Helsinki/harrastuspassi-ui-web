import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
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
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import OrganizerModalButton from './OrganizerModalButton';
import LocationModalButton from './LocationModalButton';
import HobbyEventModalButton from './HobbyEventModalButton';
import HobbyEventItem from './HobbyEventItem';
import ActionCreators from '../../actions';
import { useDeepCompareEffect } from '../../hooks';

const HobbyForm = ({ cancelUrl }) => {
  const categoryState = useSelector(state => state.categories);
  const organizerState = useSelector(state => state.organizers);
  const locationState = useSelector(state => state.locations);
  const formState = useSelector(state => state.formData);
  const history = useHistory();

  const [hobbyEventData, setHobbyEventData] = React.useState([]);
  const [priceValue, setPriceValue] = React.useState('free');

  const dispatch = useDispatch();
  const handleChange = event => {
    const reader = new FileReader();
    const { name, value } = event.target;
    switch (event.target.name) {
      case 'cover_image':
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
          const image = reader.result;
          dispatch(ActionCreators.setFormData(name, image));
        };
        reader.onerror = () => {
          window.alert('Kuvan käsittelyssä tapahtui virhe!');
        };
        break;
      case 'price_type':
        setPriceValue(event.target.value);
        if (event.target.value === 'free') {
          dispatch(ActionCreators.setFormData('price_amount', 0));
        }
        dispatch(ActionCreators.setFormData(name, value));
        break;
      default:
        dispatch(ActionCreators.setFormData(name, value));
    }
  };

  const nameValidator = () => {
    let isValid = true;
    if (formState.hobby.name && formState.hobby.name.length > 1024) {
      console.log(1);
      isValid = false;
    }
    if (!formState.hobby.name) {
      console.log(2);
      isValid = false;
    }
    if (formState.hobby.name && formState.hobby.name.length < 1) {
      console.log(3);
      isValid = false;
    }
    return isValid;
  };

  const orgnanizerValidator = () => {
    let isValid = true;
    if (!formState.hobby.organizer) {
      isValid = false;
    }
    return isValid;
  };

  const locationValidator = () => {
    let isValid = true;
    if (!formState.hobby.location) {
      isValid = false;
    }
    return isValid;
  };

  const descriptionValidator = () => {
    let isValid = true;
    if (formState.hobby.description && formState.hobby.description.length < 1) {
      isValid = false;
    }
    if (!formState.hobby.description) {
      isValid = false;
    }
    return isValid;
  };

  const categoryValidator = () => {
    let isValid = true;
    if (formState.hobby.categories && formState.hobby.categories.length < 1) {
      isValid = false;
    }
    if (!formState.hobby.categories) {
      isValid = false;
    }
    return isValid;
  };

  const priceValidator = () => {
    let isValid = true;
    if (formState.hobby.price_type && formState.hobby.price_type !== 'free') {
      if (!formState.hobby.price_amount) {
        isValid = false;
      }
    }
    return isValid;
  };
  const validateForm = () => {
    console.log('name', nameValidator());
    console.log('location', locationValidator());
    console.log('desc', descriptionValidator());
    console.log('org', orgnanizerValidator());
    console.log('price', priceValidator());
    console.log('category', categoryValidator());

    console.log(
      nameValidator() &&
        locationValidator() &&
        priceValidator() &&
        categoryValidator() &&
        descriptionValidator() &&
        orgnanizerValidator()
    );
    return (
      nameValidator() &&
      locationValidator() &&
      priceValidator() &&
      categoryValidator() &&
      descriptionValidator() &&
      orgnanizerValidator()
    );
  };
  const handleRemoveEvent = id => {
    const filteredEvents = formState.hobbyEvents.filter(item => item.id !== id);
    dispatch(ActionCreators.removeHobbyEvent(filteredEvents));
  };

  const handleNewEvent = data => {
    setHobbyEventData([data, ...hobbyEventData]);
  };

  const constructCategoryName = category => {
    let displayName = '';
    for (let index = 0; index < category.level; index += 1) {
      console.log('lol');
      displayName += '>';
    }
    displayName += ` ${category.name}`;
    return displayName;
  };

  const categoryListItems = categoryState.categories.map((category, index) => (
    <MenuItem value={category.id} key={index}>
      {constructCategoryName(category)}
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
      margin: theme.spacing(1)
    },
    leftIcon: {
      marginRight: theme.spacing(1)
    },
    cancelButton: {
      marginRight: theme.spacing(2)
    }
  }));

  const classes = useStyles();

  const submitHandler = event => {
    event.preventDefault();
    dispatch(ActionCreators.createHobby(formState.hobby));
  };

  useDeepCompareEffect(() => {
    const postedEvents = [...formState.hobbyEvents];
    if (formState.hobby.id) {
      postedEvents.forEach((object, index) => {
        /* eslint-disable no-unused-vars */
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
      history.push('/');
    }
  }, [formState.hobby.id]);

  return (
    <form onSubmit={submitHandler}>
      <Box mt={4}>
        <FormControl fullWidth>
          <TextField
            id="name"
            name="name"
            required
            label="Nimi"
            margin="dense"
            variant="outlined"
            onChange={handleChange}
          />
        </FormControl>
      </Box>

      <Box mt={4} style={{ display: 'inline-flex' }} width={1}>
        <div style={{ width: '100%' }}>
          <FormControl fullWidth required>
            <InputLabel>Sijainti</InputLabel>
            <Select
              id="location"
              required
              name="location"
              value={formState.hobby.location || null}
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
          <p style={{ fontSize: 14 }}>
            Suurin sallittu tiedostokoko: 2 Mt. Kuvan optimaalinen resoluutio on
            n. 1280x720 px.{' '}
          </p>
        </FormControl>
      </Box>

      <Box mt={4}>
        <FormControl fullWidth>
          <TextField
            id="description"
            name="description"
            label="Kuvaus"
            margin="dense"
            variant="outlined"
            required
            onChange={handleChange}
          />
        </FormControl>
      </Box>

      <Box mt={4} style={{ display: 'inline-flex' }} width={1}>
        <div style={{ width: '100%' }}>
          <FormControl fullWidth required>
            <InputLabel>Järjestäjä</InputLabel>
            <Select
              required
              id="organizer"
              name="organizer"
              value={formState.hobby.organizer || ''}
              onChange={handleChange}
            >
              {organizerListItems}
            </Select>
          </FormControl>
        </div>
        <OrganizerModalButton />
      </Box>

      <Box mt={4}>
        <FormControl fullWidth required>
          <InputLabel htmlFor="select-multiple-chip">Kategoriat</InputLabel>
          <Select
            multiple
            required
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
                      categoryState.categories.find(obj => obj.id === value)
                        .name
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

      <Box mt={4} style={{ display: 'inline-flex' }} width={1}>
        <div style={{ width: '100%' }}>
          <FormControl fullWidth>
            <FormLabel component="legend">Hinnan tyyppi</FormLabel>
            <RadioGroup
              name="price_type"
              value={priceValue}
              onChange={handleChange}
            >
              <FormControlLabel
                value="free"
                control={<Radio />}
                label="Ilmainen"
              />
              <FormControlLabel
                value="annual"
                control={<Radio />}
                label="Vuosimaksu"
              />
              <FormControlLabel
                value="seasonal"
                control={<Radio />}
                label="Kausimaksu"
              />
              <FormControlLabel
                value="one_time"
                control={<Radio />}
                label="Kertamaksu"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </Box>
      {formState.hobby.price_type && formState.hobby.price_type !== 'free' && (
        <Box mt={4} style={{ display: 'inline-flex' }} width={1}>
          <div style={{ width: '100%' }}>
            <FormControl fullWidth>
              <TextField
                id="price_amount"
                name="price_amount"
                label="Hinta *"
                margin="dense"
                variant="outlined"
                onChange={handleChange}
              />
            </FormControl>
          </div>
        </Box>
      )}
      <Box mt={4}>
        <Grid container justify="space-between">
          <Grid item>
            <Typography variant="h4">Tapahtumat</Typography>
          </Grid>
          <Grid item>
            <HobbyEventModalButton handleNewEvent={handleNewEvent} />
          </Grid>
        </Grid>
        <p>
          Mikäli haluat luoda toistuvia tapahtumia, ota yhteyttä
          tukiosoitteeseen harrastuspassi@tuki.haltu.fi
        </p>
      </Box>

      {hobbyEventItems}

      <Box mt={10} mb={3}>
        {!validateForm() && (
          <p style={{ color: 'red' }}>
            Tähdellä merkityt kentät ovat pakollisia!
          </p>
        )}
        <Grid container justify="flex-end">
          <Grid item>
            <Button
              component={Link}
              to={cancelUrl}
              className={classes.cancelButton}
            >
              Peruuta
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!validateForm()}
            >
              Tallenna
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default HobbyForm;
