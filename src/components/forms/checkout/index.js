import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  Typography,
  withStyles,
  Grid,
  TextField,
  Paper,
  Button,
  IconButton
} from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CardNumberMask from './card_number_mask';
import ExpireDateMask from './expire_date_mask';
import CVVMask from './cvv_mask';

const styles = theme => ({
  root: {
    marginTop: '10px'
  },
  control: {
    padding: theme.spacing.unit * 2,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0
  },
  button: {
    margin: theme.spacing.unit,
    width: '50%'
  },
  submitButton: {
    margin: theme.spacing.unit,
    textAlign: 'center'
  },
  arrowButton: {
    marginLeft: -12,
    marginRight: 20
  }
});

class CheckoutForm extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    cardholderName: PropTypes.string.isRequired,
    cardNumber: PropTypes.string.isRequired,
    expireDate: PropTypes.string.isRequired,
    cvv: PropTypes.string.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    onBackButtonClick: PropTypes.func.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
  };

  render() {
    const {
      classes,
      paymentMethod,
      amount,
      currency,
      cardholderName,
      cardNumber,
      expireDate,
      cvv,
      onBackButtonClick,
      onFormSubmit,
      errors
    } = this.props;
    const errorText = {
      REQUIRED: 'Required',
      INVALID_CARD_NUMBER: 'Invalid card number',
      INVALID_DATE: 'Enter month/year in the future'
    };

    return (
      <div className={classes.root}>
        <AppBar position='static' color='default'>
          <Toolbar>
            <IconButton
              className={classes.arrowButton}
              color='inherit'
              onClick={onBackButtonClick}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant='title' color='inherit'>
              {`Checkout with ${paymentMethod}`}
            </Typography>
          </Toolbar>
        </AppBar>
        <form onSubmit={onFormSubmit}>
          <Paper className={classes.control}>
            <Grid container spacing={40}>
              <Grid item sm={12} xs={12}>
                <TextField
                  id='cardholder-name'
                  label='Cardholder name'
                  value={cardholderName}
                  placeholder={'John Doe'}
                  fullWidth
                  onChange={this.props.onFieldChange.bind(null, 'cardholderName')}
                  error={!!errors.cardholderName}
                  helperText={errors.cardholderName ? errorText[errors.cardholderName] : false}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextField
                  id='card-number'
                  label='Card number'
                  value={cardNumber}
                  placeholder={'XXXX XXXX XXXX XXXX'}
                  InputProps={{
                    inputComponent: CardNumberMask,
                  }}
                  fullWidth
                  onChange={this.props.onFieldChange.bind(null, 'cardNumber')}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber ? errorText[errors.cardNumber] : false}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id='expire-date'
                  label='Expire date'
                  value={expireDate}
                  placeholder={'MM/YYYY'}
                  fullWidth
                  InputProps={{
                    inputComponent: ExpireDateMask,
                  }}
                  onChange={this.props.onFieldChange.bind(null, 'expireDate')}
                  error={!!errors.expireDate}
                  helperText={errors.expireDate ? errorText[errors.expireDate] : false}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id='cvv'
                  label='CVV'
                  value={cvv}
                  placeholder={'XXX'}
                  fullWidth
                  InputProps={{
                    inputComponent: CVVMask,
                  }}
                  onChange={this.props.onFieldChange.bind(null, 'cvv')}
                  error={!!errors.cvv}
                  helperText={errors.cvv ? errorText[errors.cvv] : false}
                />
              </Grid>
            </Grid>
            <div className={classes.submitButton}>
              <Button
                variant='outlined'
                color='primary'
                className={classes.button}
                type='submit'
              >
                { `Pay ${amount} ${currency}` }
              </Button>
            </div>
          </Paper>
        </form>
      </div>
    );
  };
}

export default withStyles(styles)(CheckoutForm);
