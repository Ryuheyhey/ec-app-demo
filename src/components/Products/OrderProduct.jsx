import React, {useCallback} from "react"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemText from "@material-ui/core/ListItemText"
import Divider from "@material-ui/core/ListItemText"
import {PrimaryButton} from "../UIkit"
import {useDispatch} from "react-redux"
import {push} from "connected-react-router"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  list: {
    height: 'auto',
    background: '#fff'
  },
  image: {
    objectFit: 'cover',
    margin: '8px 16px 8px 0',
    height: 96,
    width: 96,
    width: 96
  },
  text: {
    width: "100%"
  }
}))

const OrderProduct = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const products = props.products
  
  const goToProductDetail = useCallback((id) => {
    dispatch(push('/product/' + id))
  }, [])

 return (
   <List>
     {products.length > 0 && (
       products.map(product => (
        <>
         <ListItem className={classes.list}>
           <ListItemAvatar>
             <img 
              className={classes.image}
              src={product.images[0].path}
              alt="商品画像"
             />
           </ListItemAvatar>
           <div className={classes.text}>
          <ListItemText
            primary={product.name}
            secondary={"サイズ: " + product.size}
            />
           <ListItemText
             primary={"¥" + product.price.toLocaleString()}
           />
           </div>
        <PrimaryButton label={"詳細"} onClick={() => goToProductDetail(product.id)}/>
     </ListItem>
     <Divider />
     </>
       ))
     )}

   </List>
 )
}

export default OrderProduct