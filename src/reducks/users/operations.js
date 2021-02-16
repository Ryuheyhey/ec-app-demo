import {signInAction,signOutAction,fetchProductsInCartAction, fetchProductsInLikesAction, fetchOrdersHistryAction} from "./actions";
import {push} from "connected-react-router";
import {auth, db, FirebaseTimestamp} from '../../firebase/index'

const userRef = db.collection('users')

export const addProductToLikes = (addedProduct) => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const likeRef = userRef.doc(uid).collection('likes').doc()
    addedProduct['likeId'] = likeRef.id

    await likeRef.set(addedProduct)
  }
}

export const addProductToCart = (addedProduct) => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const cartRef = userRef.doc(uid).collection('cart').doc()
    addedProduct['cartId'] = cartRef.id;
    
    // await console.log(addedProduct)
    await cartRef.set(addedProduct);
    dispatch(push('/'))
  }
}

// Actionを送信するだけの関数

export const fetchProductsInLikes = (products) => {
  return async (dispatch) => {
    dispatch(fetchProductsInLikesAction(products))
  }
}

export const fetchProductsInCart = (products) => {
  return async (dispatch) => {
    dispatch(fetchProductsInCartAction(products))
  }
}

// 注文履歴を取得してActionを送信する関数
export const fetchOrdersHistry = () => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const list = [];

    db.collection('users').doc(uid).collection('orders').orderBy('update_at', 'desc').get()
      .then((snapshots) => {
        snapshots.forEach(snapshot => {
          const data = snapshot.data();
          list.push(data)
        })

        dispatch(fetchOrdersHistryAction(list))

      })

  }
}

export const listenAuthState = () => {
  return async(dispatch) => {
    return auth.onAuthStateChanged(user => {
      if(user) {
        const uid =user.uid

          db.collection('users').doc(uid).get()
            .then(snapshot => {
              const data = snapshot.data()

              dispatch(signInAction({
                customer_id: (data.customer_id) ? data.customer_id : "",
                email: data.email,
                isSignedIn: true,
                payment_method_id: (data.payment_method_id) ? data.payment_method_id : "",
                role: data.role,
                uid: uid,
                username: data.username
              }))
            })
      } else {
        dispatch(push('/signin'))
      }
    })
  }
}

export const resetPassword = (email) =>{
  return async(dispatch) => {
    if (email === "") {
      alert("必須項目が未入力です。")
      return false
    } else {
      auth.sendPasswordResetEmail(email)
        .then(()=>{
          alert ('入力されたアドレスにパスワードリセット用のメールを送信しました。')
          dispatch(push('/signin'))
        }).catch (()=> {
          alert ('パスワードリセットに失敗しました。通信環境を確認してください。')
        })
    }
  }
}

export const signIn = (email, password) => {
  // 非同期処理の制御
  return async (dispatch) => {

    if (email === "" || password === "") {
      alert("必須項目が未入力です。")
      return false
    }

    auth.signInWithEmailAndPassword(email,password)
      .then(result => {
        const user = result.user

        if (user) {
          const uid =user.uid

          db.collection('users').doc(uid).get()
            .then(snapshot => {
              const data = snapshot.data()

              dispatch(signInAction({
                customer_id: (data.customer_id) ? data.customer_id : "",
                payment_method_id: (data.payment_method_id) ? data.payment_method_id : "",
                isSignedIn: true,
                email: data.email,
                role: data.role,
                uid: uid,
                username: data.username
              }))
              console.log(data.role)
              dispatch(push('/'))
            })
            
        }
      })
        
      

  }
  
                            
    
}

export const signUp = (username, email, password, confirmPassword) => {
  return async (dispatch) => {

    if (username === "" || email === "" || password === "" || confirmPassword === "") {
      alert("必須項目が未入力です。")
      return false
    }

    if (password !== confirmPassword) {
      alert("パスワードが一致しません。もう一度お試しください。")
      return false
    }

    return auth.createUserWithEmailAndPassword(email, password) 
      .then(result => {
        const user = result.user

        if (user) {
          const uid = user.uid
          const timestamp = FirebaseTimestamp.now()

          const userInitialDate = {
            create_at: timestamp,
            email: email,
            role: "customer",
            uid: uid,
            update_at: timestamp,
            username: username
          }
          
          // docの名前はuidと一致させてた方が分かりやすい
          db.collection('users').doc(uid).set(userInitialDate)
            .then(()=>{
              dispatch(push("/"))
            })
        }
      })

  }
} 

export const signOut = () => {
  return async(dispatch) => {
      auth.signOut()
      .then(()=>{
        dispatch(signOutAction());
        dispatch(push('/signin'))
      })
  }
}
