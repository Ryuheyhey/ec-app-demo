import { db, FirebaseTimestamp } from "../../firebase"
import {push} from "connected-react-router";
import {deleteProductAction, fetchProductsAction} from './actions'


const productsRef = db.collection('products')

export const deleteProduct = (id) => {
  
  return async (dispatch, getState) => { 
    
     productsRef.doc(id).delete()
      .then(()=>{
        const prevProducts = getState().products.list
        const nextProducts = prevProducts.filter(product => product.id !== id)
        dispatch(deleteProductAction(nextProducts))
      }) 
    }   
    
  }


export const fetchProducts = (gender, category, search) => {
  // actionsのリストの中にproductsのデータを追加する処理
  return async (dispatch) => {
    let query = productsRef.orderBy('updated_at', 'desc')
    // whereで検索の条件を指定（複合クエリ）
    query = (gender !== "") ? query.where('gender', '==', gender) : query
    query = (category !== "") ? query.where('category', '==', category) : query
    query = (search !== "") ? query.where('name', '==', search) : query

    console.log(query)

    query.get()
      .then(snapshots => {
        const productList = []
        snapshots.forEach(snapshot => {
          const product = snapshot.data()
          productList.push(product)
        })
        dispatch(fetchProductsAction(productList))
      })
    }
}

export const orderProduct = (productsInCart, amount) => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const userRef = db.collection('users').doc(uid);
    const timestamp = FirebaseTimestamp.now();

    let products = [],
        soldOutProducts = [];

    const batch = db.batch();

    for (const product of productsInCart) {
      const snapshot = await productsRef.doc(product.productId).get();
      const sizes = snapshot.data().sizes;

      const updateSizes = sizes.map(size => {
        // productはカートの中の商品
        if (size.size === product.size) {
          if (size.quantiry === 0) {
            soldOutProducts.push(product.name);
            return size;
          }
          return {
            size: size.size,
            quantity: size.quantity - 1
          }
        } else {
          return size
        }
      })

      // 注文履歴の中の商品一覧
      products.push({
        id: product.productId,
        images: product.images,
        name: product.name,
        price: product.price,
        size: product.size
      })

      // batch処理
      batch.update(
        productsRef.doc(product.productId),
        {sizes: updateSizes}
      )

      batch.delete(
        userRef.collection('cart').doc(product.cartId)
      )
    }

    if (soldOutProducts.length > 0) {
      const errorMessage = (soldOutProducts > 1) ? soldOutProducts.join('と') : soldOutProducts[0]

      alert ('大変申し訳ありません' + errorMessage + 'が在庫切れとなったため、注文をキャンセルしました。')
      return false
    } else {

      batch.commit()
        .then(() => {
          const date = timestamp.toDate();
          const orderRef = userRef.collection('orders').doc();
          const shippingDate = FirebaseTimestamp.fromDate(new Date(date.setDate(date.getDate() + 3)));
          
          // 注文履歴
          const history = {
            amount: amount,
            created_at: timestamp,
            id: orderRef.id,
            products: products,
            shippingDate: shippingDate,
            update_at: timestamp
          }

          orderRef.set(history)
          dispatch(push('/order/complete'))

        }).catch (() => {
          alert('注文処理に失敗しました。通信環境をご確認の上、もう一度お試しください。')
          return false
        })
    }
  }
}

export const saveProduct = (id, name, description, category, gender, images, price, sizes) => {
  return async (dispatch) => {
    const timestamp = FirebaseTimestamp.now()

    const data = {
      id: id,
      category: category,
      description: description,
      gender: gender,
      name: name,
      images: images,
      price: parseInt(price, 10),
      sizes: sizes,
      updated_at: timestamp
    }

    // この定数でIDを生成
    if (id === ""){
      const ref = productsRef.doc();
      id = ref.id
      data.id = id
      data.created_at = timestamp
    }

    return productsRef.doc(id).set(data, {marge:true})
      .then(()=>{
        dispatch(push('/'))
      }).catch((error) => {
        throw new Error(error)
      })
  }
}
