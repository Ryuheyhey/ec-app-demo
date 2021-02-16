import React, { useEffect } from "react";
import List from "@material-ui/core/List"
import {makeStyles} from "@material-ui/styles"
import {getOrdersHistory, getUserId} from "../reducks/users/selectors"
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersHistry } from "../reducks/users/operations";
import {OrderHistoryItem} from "../components/Products"

const useStyles = makeStyles((theme) => ({
  orderList: {
    background: theme.palette.grey["100"],
    margin: '0 auto',
    padding: 32,
    [theme.breakpoints.down('md')]: {
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      width: 768
    }
  }
}))

const OrderHistory = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const orders = getOrdersHistory(selector);
  // const id = getUserId(selector)
  
  const classes = useStyles();

  // マウント時にordersに注文履歴のデータを入れる
  useEffect(() => {
    dispatch(fetchOrdersHistry()) 
  }, [])

  console.log(orders)

  return (
    <section className="c-section-wrapin">
      <List className={classes.orderList}>
        {orders.length > 0 && (
          orders.map(order => <OrderHistoryItem key={order.id} order={order}/>)
        )}
      </List>
    </section>
  ) 
  

}

export default OrderHistory