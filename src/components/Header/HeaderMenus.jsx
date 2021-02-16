import React, { useEffect } from "react"
import IconButton from "@material-ui/core/IconButton"
import Badge from "@material-ui/core/Badge"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"
import MenuIcon from "@material-ui/icons/Menu"
import {getProductsInLikes, getProductsInCart, getUserId} from "../../reducks/users/selectors"
import { useDispatch, useSelector } from "react-redux"
import {db} from "../../firebase/index"
import { fetchProductsInCart, fetchProductsInLikes } from "../../reducks/users/operations"
import { push } from 'connected-react-router'

const HeaderMenus = (props) => {

  const selector = useSelector((state)=> state)
  const uid = getUserId(selector)
  let productsInCart = getProductsInCart(selector)
  let productsInLikes = getProductsInLikes(selector)
  const dispatch = useDispatch()


  useEffect(() => {
    const unsubscribe = db.collection("users").doc(uid).collection("cart")
      .onSnapshot(snapshots => {
        snapshots.docChanges().forEach(change => {
          // changeにはカートに入れた商品の情報が入っている
          const product = change.doc.data();
          const changeType = change.type;

          // productsInCartの中身を変更する処理
          switch (changeType) {
            case 'added':
              productsInCart.push(product);
              break;
            case 'modified':
              // 変更された配列の番号を取得
              const index =   productsInCart.findIndex(product => product.cartId === change.doc.id)
              productsInCart[index] = product
              break;
            case 'removed':
            productsInCart = productsInCart.filter(product => product.cartId !== change.doc.id)
            break;
          }
        })

        dispatch(fetchProductsInCart(productsInCart))
      })
      return () => unsubscribe()
  }, [])

  useEffect(() => {
    const unsubscribe = db.collection("users").doc(uid).collection("likes")
      .onSnapshot(snapshots => {
        snapshots.docChanges().forEach(change => {
          // changeにはカートに入れた商品の情報が入っている
          const product = change.doc.data();
          const changeType = change.type;

          // productsInCartの中身を変更する処理
          switch (changeType) {
            case 'added':
              productsInLikes.push(product);
              break;
            case 'modified':
              // 変更された配列の番号を取得
              const index =   productsInLikes.findIndex(product => product.likeId === change.doc.id)
              productsInLikes[index] = product
              break;
            case 'removed':
            productsInLikes = productsInLikes.filter(product => product.likeId !== change.doc.id)
            break;
          }
        })

        dispatch(fetchProductsInLikes(productsInLikes))
      })
      return () => unsubscribe()
  }, [])

  return(
    <>
      <IconButton onClick={()=>dispatch(push('/cart/?cart'))}>
        <Badge badgeContent={productsInCart.length} color="secondary">
          <ShoppingCartIcon/>
        </Badge>
      </IconButton>
      <IconButton onClick={()=>dispatch(push('/likes/?likes'))}>
        <Badge badgeContent={productsInLikes.length} color="secondary">
          <FavoriteBorderIcon/>
        </Badge>
      </IconButton>
      <IconButton onClick={(event)=>props.handleDrawerToggle(event)}>
        <MenuIcon/>
      </IconButton>
    </>
  )
}

export default HeaderMenus