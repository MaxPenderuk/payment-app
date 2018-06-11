import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  withStyles,
  Button,
  Paper,
  CircularProgress
} from '@material-ui/core';
import currenciesList from '../../etc/currencies';
import countriesList from '../../etc/countries';
import { getCountryByCoords } from '../../api/index';

const currencies = Object.keys(currenciesList).map(item => {
  return { label: item, value: item };
});
const countries = Object.keys(countriesList).map(item => {
  return { label: countriesList[item], value: countriesList[item] };
});
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  fullWidth: {
    width: '100%',
  },
  button: {
    width: '100%',
    margin: theme.spacing.unit,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  control: {
    width: '100%',
    padding: theme.spacing.unit * 2,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0
  },
  progress: {
    marginRight: '10px'
  }
});

class AmountForm extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    currency: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    onFieldValueChange: PropTypes.func.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.getGeolocation();
  }

  getGeolocation() {
    const geolocation = navigator.geolocation ? navigator.geolocation : {
      getCurrentPosition(success, failure) {
          failure("Your browser doesn't support geolocation.");
      }
    };

    geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;

        getCountryByCoords(latitude, longitude).then(country => {
          this.setState({ isLoading: false }, () => {
            this.props.onFieldValueChange('country', {
              target: { value: country.long_name }
            });
          });
        });
    }, () => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { classes, errors } = this.props;
    const { isLoading } = this.state;
    const errorText = {
      REQUIRED: 'Required',
      NOT_DECIMAL: 'Is not a number'
    };

    return (
      <form className={classes.container} onSubmit={this.props.onFormSubmit}>
        <Paper className={classes.control}>
          <Grid container spacing={8}>
            <Grid item xs={12} sm={4}>
              <FormControl className={classes.fullWidth}>
                <TextField
                  id='amount'
                  label='Amount'
                  value={this.props.amount}
                  onChange={this.props.onFieldValueChange.bind(null, 'amount')}
                  error={!!errors.amount}
                  helperText={errors.amount ? errorText[errors.amount] : false}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl className={classes.fullWidth}>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={this.props.currency}
                    onChange={this.props.onFieldValueChange.bind(null, 'currency')}
                    error={!!errors.currency}
                  >
                    {
                      currencies.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))
                    }
                  </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl className={classes.fullWidth}>
                  <InputLabel>Country</InputLabel>
                  <Select
                    value={this.props.country}
                    onChange={this.props.onFieldValueChange.bind(null, 'country')}
                    error={!!errors.country}
                  >
                    {
                      countries.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))
                    }
                  </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant='outlined'
                color='primary'
                className={classes.button}
                type='submit'
                disabled={isLoading}
                >
                  {
                    isLoading
                    ? <CircularProgress size={14} className={classes.progress}/>
                    : null
                  }
                  {'Continue'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
    );
  }
}

export default withStyles(styles)(AmountForm);
