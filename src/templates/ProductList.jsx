import React, { useEffect } from 'react'
import {ProductCard} from '../components/Products/index'
import {useDispatch, useSelector} from 'react-redux'
import {fetchProducts} from '../reducks/products/operations'
import {getProducts} from "../reducks/products/selectors"
import {signOut} from "../reducks/users/operations"

const ProductList = () => {
  const dispatch = useDispatch()
  // 商品情報を取得
  const selector = useSelector((state) => state)
  const products = getProducts(selector)
  const query = selector.router.location.search;

  // queryの最初の文字が?genderだったらその後ろのidをgenderに入れる
  const gender = /^\?gender=/.test(query) ? query.split('?gender=')[1] : ""
  const category = /^\?category=/.test(query) ? query.split('?category=')[1] : ""
  const search = /^\?search=/.test(query) ? query.split('?search=')[1] : ""

  console.log(search)

  // マウント時にクラウドから商品情報を取得してくるoperationの関数をdispatch
  useEffect(() => {
    dispatch(fetchProducts(gender, category, search))
  }, [query])

 return (
   <section className="c-section-wrapin">
     <div className="p-grid__row">
      {products.length > 0 && (
        products.map(product => (
          <ProductCard 
            key={product.id} 
            id={product.id}
            images={product.images}
            category={product.category}
            description={product.description}
            gender={product.gender}
            name={product.name}
            price={product.price}
            sizes={product.sizes}
            updated_at={product.updated_at}
            />
        ))
      )}
      
     </div>
   </section>
 )
}

export default ProductList