// StoreのinitialState 全データの初期状態を記述


export const initialState = {
  products: {
    list:[]
  },
  users: {
    customer_id:"",
    payment_method_id: "",
    likes:[],
    cart: [],
    email:[],
    isSignedIn: false,
    orders: [],
    role:"",
    uid: "",
    username: ""
  }
}

// export default initialState