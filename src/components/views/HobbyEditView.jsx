import React from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Typography, Container } from '@material-ui/core';
import ActionCreators from '../../actions';
import { useDeepCompareEffect, useSelector } from '../../hooks';
import HobbyEditForm from '../blocks/HobbyEditForm';

const HobbyEditView = props => {
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);
  const { id } = props.match.params;
  useDeepCompareEffect(() => {
    if (authState.accessToken) {
      // initial data fetch
      dispatch(ActionCreators.fetchCategories());
      dispatch(ActionCreators.fetchOrganizers());
      dispatch(ActionCreators.fetchLocations());
      dispatch(ActionCreators.fetchHobby(id));
      dispatch(ActionCreators.fetchHobbyEvents(id));
    }
  }, [authState.accessToken]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Muokkaa harrastusta</Typography>
      <HobbyEditForm cancelUrl="/" />
    </Container>
  );
};

export default withRouter(HobbyEditView);
