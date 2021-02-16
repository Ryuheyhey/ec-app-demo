import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux";
import { db, FirebaseTimestamp } from '../firebase';
import HTMLReactParser from "html-react-parser"
import {ImageSwiper, SizeTable} from "../components/Products"
import {addProductToCart, addProductToLikes} from "../reducks/users/operations"

const useStyles = makeStyles((theme) => ({
  sliderBox: {
    [theme.breakpoints.down('sm')]:{
      margin:0,
      heiht:320,
      width:320
    },
    [theme.breakpoints.up('sm')]:{
      margin:'0 auto',
      heiht:400,
      width:400
    }
  },
  detail: {
    textAlign: 'left',
    [theme.breakpoints.down('sm')]:{
      margin:'0 auto 16px auto',
      heiht:"auto",
      width:320
    },
    [theme.breakpoints.up('sm')]:{
      margin:'0 auto',
      heiht:"auto",
      width:400
    }
  },
  price: {
    fontSize: 32
  }
}))

const ReturnCodeToBr = (text) => {
  if(text === "") {
    return text
  } else {
    return HTMLReactParser(text.replace(/\r?\n/g, '<br/>'))
  }
}

const ProductDetail = () => {

  const classes = useStyles()

  const selector = useSelector((state=> state))
  const path = selector.router.location.pathname
  const id = path.split('/product/')[1]
  const dispatch = useDispatch()

  const [product, setProduct] = useState(null)

  useEffect(() => {
    db.collection('products').doc(id).get()
    .then(doc=> {
      const data = doc.data()
      setProduct(data)
    })
  }, [])

  const addLikes = useCallback((selectedSize) => {
    const timestamp = FirebaseTimestamp.now()
    dispatch(addProductToLikes({
      added_at: timestamp,
      description: product.description,
      gender: product.gender,
      images: product.images,
      name: product.name,
      productId: product.id,
      quantity: 1,
      price:product.price,
      size: selectedSize
    }))
  }, [product])

  const addProduct = useCallback((selectedSize) => {
    const timestamp = FirebaseTimestamp.now()
    dispatch(addProductToCart({
      added_at: timestamp,
      description: product.description,
      gender: product.gender,
      images: product.images,
      name: product.name,
      productId: product.id,
      quantity: 1,
      price:product.price,
      size: selectedSize
    }))
  }, [product])

  return (
   <section className="c-section-wrapin">
    {product && (
      <div className="p-grid__row">
      <div className={classes.sliderBox}>
        <ImageSwiper images={product.images}/>
      </div>
      <div className={classes.detail}>
        <h2 className="u-text__headline">{product.name}</h2>
        <p className={classes.price}>{"¥" + product.price.toLocaleString()}</p>
        <div className="module-spacer--small" />

        <p>{ReturnCodeToBr(product.description)}</p>

        <div className="module-spacer--small" />
        <SizeTable 
          sizes={product.sizes}   
          addProduct={addProduct}
          addLikes={addLikes}
          />

      </div>
      </div>
    )}

    
   </section>
 )
}

export default ProductDetail