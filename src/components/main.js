import React, { Component, Fragment } from 'react';
import { AppBar, Toolbar, Typography, Snackbar, IconButton } from '@material-ui/core';
import Done from '@material-ui/icons/Done';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import LIVR from 'livr';
import luhn from 'luhn';

import AmountForm from './forms/amount';
import CheckoutForm from './forms/checkout/index';
import PaymentMethod from './payment_method';

import { createPayment } from '../api/index';

export default class Main extends Component {
  constructor() {
    super();

    this.state = {
      amount: '',
      currency: 'USD',
      country: '',
      component: 'amount',
      paymentMethod: '',
      cardholderName: '',
      cardNumber: '',
      expireDate: '',
      cvv: '',
      errors: {},
      showMessage: {
        type: '',
        open: false
      }
    };

    this.onAmountFieldValueChange = this.onAmountFieldValueChange.bind(this);
    this.onAmountFormSubmit = this.onAmountFormSubmit.bind(this);
    this.onPaymentMethodSelect = this.onPaymentMethodSelect.bind(this);
    this.onCheckoutFieldsChange = this.onCheckoutFieldsChange.bind(this);
    this.onCheckoutBackButtonClick = this.onCheckoutBackButtonClick.bind(this);
    this.onCheckoutFormSubmit = this.onCheckoutFormSubmit.bind(this);
    this.onMessageClose = this.onMessageClose.bind(this);
  }

  onAmountFieldValueChange(field, event) {
    const state = this.state;

    state[field] = event.target.value;
    state.component = 'amount';
    
    if (state.errors[field]) {
      delete state.errors[field];
    }

    this.setState(state);
  }

  onAmountFormSubmit(event) {
    event.preventDefault();

    const { amount, currency, country } = this.state;

    const isValid = this.validate({ amount, currency, country }, 'amount');

    if (isValid) {
      this.setState({ component: 'payment_method' });
    }
  }

  onCheckoutFieldsChange(field, event) {
    const state = this.state;

    state[field] = event.target.value;
    
    if (state.errors[field]) {
      delete state.errors[field];
    }

    this.setState(state);
  }

  onPaymentMethodSelect(method) {
    this.setState({
      paymentMethod: method,
      component: 'checkout'
    });
  }

  onCheckoutBackButtonClick() {
    this.setState({ component: 'payment_method' });
  }

  onCheckoutFormSubmit(event) {
    event.preventDefault();

    const {
      amount,
      currency,
      country,
      paymentMethod,
      cardholderName,
      cardNumber,
      expireDate,
      cvv
    } = this.state;

    const isValid = this.validate({
      cardholderName,
      cardNumber: cardNumber.replace(/ /g,''),
      expireDate,
      cvv
    }, 'checkout');

    if (isValid) {
      createPayment({
        amount,
        currency,
        country,
        paymentMethod,
        cardholderName,
        cardNumber,
        expireDate,
        cvv
      }).then(res => {
        if (res.status) {
          this.setState({
            showMessage: {
              type: 'success',
              open: true
            }
          });
        }
      })
      .catch(err => {
        this.setState({
          showMessage: {
            type: 'error',
            open: true
          }
        });
      });
    }
  }

  onMessageClose() {
    this.setState({ showMessage: {
      type: '',
      open: false
    }});
  };

  validate(data, type) {
    const rules = {
      amount: {
        amount: ['required', 'decimal'],
        currency: ['required', 'string'],
        country: ['required', 'string']
      },
      checkout: {
        cardholderName: ['required', 'string'],
        cardNumber: ['required', 'integer', 'card_number'],
        expireDate: ['required', 'string', 'year_greater_than_now'],
        cvv: ['required', 'integer']
      }
    };
    const validator = new LIVR.Validator(rules[type]);

    validator.registerRules({
      card_number: function() {
        return function(value) {
          if (!luhn.validate(value)) {
            return 'INVALID_CARD_NUMBER';
          }
        }
      },
      year_greater_than_now: function() {
        return function(value) {
          const date = new Date();
          const [month, year] = value.split('/');

          if ((Number(month) < 1 || Number(month) > 12)
            || (Number(year) < date.getFullYear())
            || (Number(month) < date.getMonth() && Number(year) === date.getFullYear())) {
            return 'INVALID_DATE';
          }

          return;
        }
      }
    });

    const validatedResult = validator.validate(data);

    if (!validatedResult) {
      const errors = validator.getErrors();

      this.setState({
        ...this.state.errors,
        errors
      });
    }

    return validatedResult;
  }

  render() {
    const {
      amount,
      currency,
      country,
      component,
      paymentMethod,
      errors,
      cardholderName,
      cardNumber,
      expireDate,
      cvv,
      showMessage
    } = this.state;

    return (
      <Fragment>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='title' color='inherit'>
              {'Make your payment'}
            </Typography>
          </Toolbar>
        </AppBar>
        <AmountForm
          amount={amount}
          currency={currency}
          country={country}
          errors={errors}
          onFieldValueChange={this.onAmountFieldValueChange}
          onFormSubmit={this.onAmountFormSubmit}
        />
        {
          component === 'payment_method'
          ?
            <PaymentMethod
              country={country}
              onSelect={this.onPaymentMethodSelect}
            />
          : null
        }
        {
          component === 'checkout'
          ?
            <CheckoutForm
              paymentMethod={paymentMethod}
              amount={amount}
              currency={currency}
              cardholderName={cardholderName}
              cardNumber={cardNumber}
              expireDate={expireDate}
              cvv={cvv}
              onFieldChange={this.onCheckoutFieldsChange}
              onBackButtonClick={this.onCheckoutBackButtonClick}
              onFormSubmit={this.onCheckoutFormSubmit}
              errors={errors}
            />
          : null
        }
        <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={showMessage.open}
          autoHideDuration={2000}
          onClose={this.onMessageClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={
            <span id='message-id'>
              {
                showMessage.type === 'error'
                ? 'Wrong CVV!'
                : ''
              }
              {
                showMessage.type === 'success'
                ? 'Success!'
                : ''
              }
            </span>
          }
          action={[
            <IconButton color='secondary' key='status'>
              {
                showMessage.type === 'error'
                ? <ErrorOutline />
                : null
              }
              {
                showMessage.type === 'success'
                ? <Done />
                : null
              }
            </IconButton>,
          ]}
        />
        </div>
      </Fragment>
    );
  }
}
