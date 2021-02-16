import {createSelector} from "reselect";

const usersSelector = (state) => state.users;

export const getOrdersHistory = createSelector(
  [usersSelector],
  state => state.orders
)

export const getCustomerId = createSelector(
  [usersSelector],
  state => state.customer_id
)

export const getPaymentMethodId = createSelector(
  [usersSelector],
  state => state.payment_method_id
)

export const getIsSignedIn = createSelector(
  [usersSelector],
  state => state.isSignedIn
)

export const getProductsInCart = createSelector(
  [usersSelector],
  state => state.cart
)

export const getProductsInLikes = createSelector(
  [usersSelector],
  state => state.likes
)

export const getUserId = createSelector(
  [usersSelector],
  state => state.uid
  // [userSelector]の中のstateのuid
)

export const getUserName = createSelector(
  [usersSelector],
  state => state.username
  // [userSelector]の中のstateのuid
)