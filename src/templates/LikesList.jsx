import React, { useCallback } from 'react'
import List from '@material-ui/core/List'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsInLikes } from '../reducks/users/selectors'
import { CartListItem } from '../components/Products/index'
import { PrimaryButton, GreyButton } from '../components/UIkit'
import { push } from 'connected-react-router'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  root:{
    margin: "0 auto",
    maxWidth: 512,
    width:"100%"
  }
})

const LikesList = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state)=>state);
  const productsInLikes = getProductsInLikes(selector);
  const classes = useStyles();

  const backToHome　= useCallback(() => {
    dispatch(push('/'))
  },[])

  return (
    <section className="c-section-wrapin">
    <h2 className="u-text__headline">お気に入り</h2>
    <List className={classes.root}>
      {productsInLikes.length > 0 && (
        productsInLikes.map(product => (
          <CartListItem key={product.cartId} product={product}/>
        ))
      )}
    </List >
    <div className="module-spacer--medium" />
    <div className="p-grid__column">
    <PrimaryButton label={"ショッピングを続ける"} onClick={backToHome}/>
   
    
    </div>
  </section>
  )
}

export default LikesList