import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  Typography,
  withStyles,
  Paper,
  Grid,
  CircularProgress
} from '@material-ui/core';
import countries from '../etc/countries';
import { getPaymentMethodsByCountryCode } from '../api/index';

const styles = theme => ({
  root: {
    marginTop: '10px'
  },
  control: {
    padding: theme.spacing.unit * 2,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  paper: {
    cursor: 'pointer',
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
  },
});

class PaymentMethod extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    country: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      methods: [],
      isLoading: true
    };

    this.handlePaymentMethodClick = this.handlePaymentMethodClick.bind(this);
  }

  componentDidMount() {
    this.getPaymentMethods();
  }

  getPaymentMethods() {
    const { country } = this.props;
    const countryCode = Object.keys(countries).find(code => {
      return countries[code] === country;
    });

    getPaymentMethodsByCountryCode(countryCode).then(paymentMethods => {
      this.setState({
        methods: this.state.methods.concat(paymentMethods),
        isLoading: false
      });
    });
  }

  handlePaymentMethodClick(method) {
    this.props.onSelect(method);
  }

  render() {
    const { classes } = this.props;
    const { methods } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position='static' color='default'>
          <Toolbar>
            <Typography variant='title' color='inherit'>
              Select Payment Method
            </Typography>
          </Toolbar>
        </AppBar>
        <Paper
          className={classes.control}
          style={this.state.isLoading ? {textAlign: 'center'} : null}
        >
          {
            this.state.isLoading
            ?
              <CircularProgress
                className={classes.progress}
                color='secondary'
                size={50}
              />
            :
              <Grid container spacing={8}>
                {
                  methods.map(item => (
                    <Grid item xs={12} sm={6} key={item.id}>
                      <Paper
                        className={classes.paper}
                        onClick={this.handlePaymentMethodClick.bind(null, item.name)}
                      >
                        <div><img src={item.img_url} alt={item.id} /></div>
                        <div>{item.name}</div>
                      </Paper>
                    </Grid>
                  ))
                }
              </Grid>
          }
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(PaymentMethod);
