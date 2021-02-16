import React, {useCallback} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {PrimaryButton, GreyButton, TextDetail} from "../components/UIkit"
import {push} from "connected-react-router"
import {getUserName} from "../reducks/users/selectors"

const UserMyPage = () => {
  const dispatch = useDispatch()
  const selector = useSelector(state => state)
  const username = getUserName(selector)

  const transition = useCallback((path) => {
    dispatch(push(path))
  })

  return (
    <section className="c-section-container">
      <h2 className="u-text__headline u-text-center">マイページ</h2>
      <div className="module-spacer--medium"/>
      <TextDetail label={"ユーザー名"} value={username} />
      <div className="module-spacer--medium"/>
      <div className="center">
        <PrimaryButton 
          label={"カード情報の編集"}
          onClick={() => transition('/user/payment/edit')}
        />
        <GreyButton 
          label={"注文履歴の確認"}
          onClick={() => transition('order/history')}
        />
      </div>
    </section>
  )
}

export default UserMyPage
