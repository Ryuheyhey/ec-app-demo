import React from 'react'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js/pure';
import {PaymentEdit} from '../components/Payment'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51IKF08InBNw9l9FfOB5zYnQdofEXZllq9WG7qyOoWjTA0ERAAuR4NV5m9Nmked0NACktj5H0PfMejrI7xQvVOwnA00nxQ1K5IR');

const CheckoutWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentEdit />
    </Elements>
  );
};

export default CheckoutWrapper