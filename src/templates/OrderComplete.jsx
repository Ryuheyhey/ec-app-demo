import React, { useEffect, useCallback} from 'react'
import List from "@material-ui/core/List"
import {makeStyles} from "@material-ui/styles"
import {getOrdersHistory, getUserId} from "../reducks/users/selectors"
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersHistry } from "../reducks/users/operations";
import {OrderCompleteItem} from "../components/Products"
import { PrimaryButton } from '../components/UIkit';
import { push } from 'connected-react-router'

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

const OrderComplete = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const orders = getOrdersHistory(selector);
  const order = orders.map(order => order)[0]
  const classes = useStyles();

  const backToHome= useCallback(() => {
    dispatch(push('/'))
  },[])

  console.log(order)

  useEffect(() => {
    dispatch(fetchOrdersHistry()) 
  }, [])

  return (
    <section className="c-section-wrapin">
      <h2 className="u-text__headline">注文が完了しました。</h2>
      <List className={classes.orderList}>
        {orders.length > 0 && 
        <OrderCompleteItem order={order}/>
        }
      </List>
      <div className="module-spacer--medium" />

      <PrimaryButton label={"ショッピングを続ける"} onClick={backToHome}/>
    </section>
  )
}

export default OrderComplete