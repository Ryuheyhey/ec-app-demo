// ここにはAPIを叩いた時に実行する関数を記述

const functions = require('firebase-functions');
const stripe = require('stripe')("sk_test_51IKF08InBNw9l9FfvE1U6G3BSKPoGesIXI14XElFeesVeNrgnniWvQ9q3JdvieLxDoWAVdEQmHTS8m1nuz2ZgAOr008y4or0aR")
// const stripe = require('stripe')(functions.config().stripe.key)
const cors = require('cors')

const sendRespons = (respons, statusCode, body) => {
  respons.send({
    statusCode,
    headers: {"Access-Control-Allow-Origin": "*"},
    body: JSON.stringify(body)
  })
}

// reqの中身
// {email: string, userId: string, paymentMethod: string}

exports.stripeCustomer = functions.https.onRequest((req, res) => {
  const corsHandler = cors({origin: true})

  corsHandler(req, res, () => {
    if(req.method !== 'POST') {
      sendRespons(res, 405, {error: "Invailed Request method"})
    }

    //顧客情報を作る
    return stripe.customers.create({
      description: "EC App demo user",
      email: req.body.email,
      metadata: {userId: req.body.userId},
      payment_method: req.body.paymentMethod
    }).then((customer) => {
      sendRespons(res, 200, customer)
    }).catch((error) => {
      sendRespons(res, 500, {error: error})
    })
  })
})

exports.retrievePaymentMethod = functions.https.onRequest((req, res) => {
  const corsHandler = cors({origin: true})

  corsHandler(req, res, () => {
    if(req.method !== 'POST') {
      sendRespons(res, 405, {error: "Invailed Request method"})
    }

    //顧客情報を作る
    return stripe.paymentMethods.retrieve(
      req.body.paymentMethodId
    ).then((paymentMethod) => {
      sendRespons(res, 200, paymentMethod)
    }).catch((error) => {
      sendRespons(res, 500, {error: error})
    })
  })
})

exports.updatePaymentMethod = functions.https.onRequest((req, res) => {
  const corsHandler = cors({origin: true})

  corsHandler(req, res, () => {
    if(req.method !== 'POST') {
      sendRespons(res, 405, {error: "Invailed Request method"})
    }

    //顧客情報を作る
    return stripe.paymentMethods.detach(
      req.body.prevPaymentMethodId
    ).then((paymentMethod) => {
      return stripe.paymentMethods.attach(
        req.body.nextPaymentMethodId,
        {customer: req.body.customerId}
      ).then((nextPaymentMethod) => {
        sendRespons(res, 200, nextPaymentMethod)
      })
    }).catch((error) => {
      sendRespons(res, 500, {error: error})
    })
  })
})
