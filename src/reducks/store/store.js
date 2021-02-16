import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware
} from "redux"
import { connectRouter, routerMiddleware } from "connected-react-router"
import thunk from "redux-thunk";

import {ProductsReducer} from "../products/reducers"
import {UsersReducer} from "../users/reducers"
import {createLogger} from "redux-logger"

export default function createStore(history) {

  const middleWares = [routerMiddleware(history), thunk]

  // 開発環境の場合はmiddleWaresにloggerを追加する
  // つまり、開発環境でのみloggerが機能する
  if(process.env.NODE_ENV === 'development') {
    const logger = createLogger({
      collapsed: true,
      diff: true
    })
    middleWares.push(logger)
  }

  

  return reduxCreateStore(
    combineReducers({
      router: connectRouter(history),
      products: ProductsReducer,
      users:UsersReducer
    }),
    // middlewareは拡張機能のようなもの
    applyMiddleware(
      ...middleWares
    )
  )
}