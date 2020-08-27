import React from 'react';
import {
  Grid,
  TextField,
  Box,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';

const HobbyEventItem = ({ data, handleRemoveEvent }) => {
  return (
    <Box mt={4}>
      <Grid
        container
        direction="row"
        spacing={3}
        style={{ flexWrap: 'nowrap' }}
      >
        <Grid item>
          <TextField
            value={
              data.start_date
                ? moment(data.start_date).format('DD.MM.YYYY')
                : null
            }
            variant="outlined"
            label="Start date"
            InputProps={{
              readOnly: true
            }}
          />
          <Box mt={3}>
            <TextField
              value={
                data.start_time ? moment(data.start_time).format('HH:mm') : null
              }
              variant="outlined"
              label="Start time"
              InputProps={{
                readOnly: true
              }}
            />
          </Box>
        </Grid>
        <Grid item>
          <TextField
            value={
              data.end_date ? moment(data.end_date).format('DD.MM.YYYY') : null
            }
            variant="outlined"
            label="End date"
            InputProps={{
              readOnly: true
            }}
          />
          <Box mt={3}>
            <TextField
              value={
                data.end_time ? moment(data.end_time).format('HH:mm') : null
              }
              variant="outlined"
              label="End time"
              InputProps={{
                readOnly: true
              }}
            />
          </Box>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={() => handleRemoveEvent(data.id)}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HobbyEventItem;
