import * as Actions from './actions'
import { initialState } from '../store/initialState'


export const UsersReducer = (state = initialState.users, action) => {
  switch (action.type) {
    case Actions.SIGN_IN:
      return {
        ...state,
        ...action.payload
      }
      
    case Actions.SIGN_OUT:
      return {
        ...action.payload
      }

    case Actions.FETCH_PRODUCTS_IN_LIKES:
      return {
        ...state,
        likes: [...action.payload]
      }  

    case Actions.FETCH_PRODUCTS_IN_CAR:
      return {
        ...state,
        cart: [...action.payload]
      }  

    case Actions.FETCH_ORDERS_HISTORY:  
      return {
        ...state,
        orders: [...action.payload]
      }

    case Actions.UPDATE_USER_STATE:
      return {
        ...state,
        ...action.payload
      }

    default:
      return state  
  }
}