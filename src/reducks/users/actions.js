// ReduxのActionsの書き方

export const FETCH_ORDERS_HISTORY = "FETCH_ORDERS_HISTORY"
export const  fetchOrdersHistryAction = (history) => {
  return {
    type: "FETCH_ORDERS_HISTORY",
    payload: history
  }
} 

export const FETCH_PRODUCTS_IN_LIKES = "FETCH_PRODUCTS_IN_LIKES"
export const  fetchProductsInLikesAction = (products) => {
  return {
    type: "FETCH_PRODUCTS_IN_LIKES",
    payload: products
  }
} 

export const FETCH_PRODUCTS_IN_CAR = "FETCH_PRODUCTS_IN_CAR"
export const  fetchProductsInCartAction = (products) => {
  return {
    type: "FETCH_PRODUCTS_IN_CAR",
    payload: products
  }
} 


export const SIGN_IN = "SIGN_IN"
export const signInAction = (usersState) => {
  return {
    type: "SIGN_IN",
    payload:{
      customer_id: usersState.customer_id,
      isSignedIn: true,
      payment_method_id: usersState.payment_method_id,
      email: usersState.email,
      role:usersState.role,
      uid: usersState.uid,
      username: usersState.username
    }
  }
} 

export const SIGN_OUT = "SIGN_OUT"
export const signOutAction = () => {
  return {
    type: "SIGN_OUT",
    payload: {
      isSignedIn: false,
      role: "",
      uid: "",
      username: "" 
    }
  }
}

export const UPDATE_USER_STATE = "UPDATE_USER_STATE"
export const updateUserStateAction = (userState) => {
  return {
    type: "UPDATE_USER_STATE",
    payload: userState
  }
}
