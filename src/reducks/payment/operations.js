// ここにはAPIを叩く関数を記述

import {CardElement} from '@stripe/react-stripe-js'
import {db} from "../../firebase/index"
import {push} from "connected-react-router"
import { updateUserStateAction } from '../users/actions'

const headers = new Headers();
headers.set('Content-type', 'application/json');
const BASE_URL = "https://ec-app-773e8.web.app"


// カード情報を新規作成する関数
const createCustomer = async (email, paymentMethodId, uid) => {
  //POSTは新規作成
  const response = await fetch(BASE_URL + '/v1/customer', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      email: email,
      paymentMethod: paymentMethodId,
      userId: uid
    })
  })

  const customerRespons = await response.json()
  return JSON.parse(customerRespons.body)
}

// カード情報を取得する関数
export const retrievePaymentMethod = async (paymentMethodId) => {
  const response = await fetch(BASE_URL + '/v1/paymentMethod', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      paymentMethodId: paymentMethodId,
    })
  })

  const paymentMethodRespons = await response.json()
  const paymentMethod =  JSON.parse(paymentMethodRespons.body)
  return paymentMethod.card
}

// カード情報を更新する関数
export const updatePaymentMethod = async (customerId, prevPaymentMethodId, nextPaymentMethodId) => {
  const response = await fetch(BASE_URL + "/v1/updatePaymentMethod", {
    method: 'POST',
    headers: headers,
    // stringifyでJSON形式に変換
    body: JSON.stringify({
      customerId: customerId,
      prevPaymentMethodId: prevPaymentMethodId,
      nextPaymentMethodId: nextPaymentMethodId
    })
  })

  const paymentMethodResponse = await response.json()
  // parseでオブジェクト形式に変換
  const paymentMethod = JSON.parse(paymentMethodResponse.body) 
  console.log(paymentMethodResponse)
  console.log(paymentMethod)
  return paymentMethod.card
}

export const registerCard = (stripe, elements, customerId) => {
  return async (dispatch, getState) => {
    const user = getState().users
    const email = user.email
    const uid = user.uid

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.log('[error]', error);
      return;
    } 
  
    const paymentMethodId = paymentMethod.id

    if (customerId === "") {
      // カード情報が未登録だったら、新規作成の処理
       const customerData = await createCustomer(email, paymentMethodId, uid)

    if (customerData.id === "") {
      alert('カード情報の新規登録に失敗しました。')
    } else {
      const updateUserState = {
        customer_id: customerData.id,
        payment_method_id: paymentMethodId
      }

      db.collection('users').doc(uid).update(updateUserState)
        .then(() => {
          dispatch(updateUserStateAction(updateUserState))
          dispatch(push('/user/mypage'))
        }).catch((error) => {
          // 本当は、Delete stripe customerを作りたい
          alert('カード情報の新規登録に失敗しました。')
          return;
        })
    }

    } else {
      const prevPaymentMethodId = getState().users.payment_method_id
      const updatedPaymentMethod = await updatePaymentMethod(customerId, prevPaymentMethodId, paymentMethodId)

      if(!updatedPaymentMethod) {
        alert('お客様情報の登録に失敗しました。')
        // console.log(paymentMethodId)
      } else {
        const userState = {
          payment_method_id: paymentMethodId
        }
        db.collection('users').doc(uid).update(userState)
          .then(() => {
            dispatch(updateUserStateAction(userState))
            alert('お客様情報を更新しました。')
            dispatch(push('/user/mypage'))
          }).catch(() => {
            alert("お客様情報の更新に失敗しました。")
          })
      }
    }
  }
}