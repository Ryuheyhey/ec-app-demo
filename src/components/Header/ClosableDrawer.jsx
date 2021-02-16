import React, { useCallback, useEffect,useState } from 'react'
import Divider from "@material-ui/core/Divider"
import Drawer from "@material-ui/core/Drawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import IconButton from "@material-ui/core/IconButton"
import SearchIcon from "@material-ui/icons/Search"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import HistoryIcon from "@material-ui/icons/History"
import PersonIcon from "@material-ui/icons/Person"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import {makeStyles} from "@material-ui/styles"
import {TextInput} from "../UIkit/index"
import { push } from 'connected-react-router'
import { useDispatch } from 'react-redux'
import {signOut} from '../../reducks/users/operations'
import { db } from '../../firebase'

const useStyles = makeStyles((theme)=>({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      flexShrink:0,
      width: 256
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 256
  },
  searchField: {
    alignItems: "center",
    display:'flex',
    marginLeft:32
  }
}))

const ClosableDrawer = (props) => {
  const classes = useStyles()
  const {container} = props
  const dispatch = useDispatch()
  
  const selectMenu = (event, path) => {
    dispatch(push(path))
    props.onClose(event)
  }

  const [keyword, setKeyword] = useState("")
  const [filters, setFilters] = useState([
    {func: selectMenu, label: "すべて", id:"all", value:"/"},
    {func: selectMenu, label: "メンズ", id:"male", value:"/?gender=male"},
    {func: selectMenu, label: "レディース", id:"female", value:"/?gender=female"},
  ])

  const inputKeyword = useCallback((event)=> {
    setKeyword(event.target.value)
  }, [setKeyword])

  const searchKeyword = (e) => {

  //  const filter = filters.filter(item => item.label === keyword)
  
  //   if(filter[0] === undefined) {
  //     alert("条件が一致しません。\nもう一度検索してください。")
  //   } else {
  //     filter[0].func(e, filter[0].value) 
  //   }
  dispatch(push(`?search=${keyword}`))
}



  

  const menus = [
    {func: selectMenu, label: "商品登録", icon: <AddCircleIcon/>, id:"register", value:"/product/edit"},
    {func: selectMenu, label: "注文履歴", icon: <HistoryIcon/>, id:"history", value:"/order/history"},
    {func: selectMenu, label: "プロフィール", icon: <PersonIcon/>, id:"profile", value:"/user/mypage"},
    
  ]

  useEffect(() => {
    db.collection('categories').orderBy('order', 'asc').get()
      .then(snapshots => {
        const list = []
        snapshots.forEach(snapshot => {
          const category = snapshot.data()
          list.push({func: selectMenu, label: category.name, id: category.id, value: `/?category=${category.id}`})
        })
        // stateの初期値＋listの中身を展開
        setFilters(prevState => [...prevState, ...list])
      })
  }, [])

  return (
    <nav>
      <Drawer
        container={container}
        variant="temporary"
        anchor="right"
        open={props.open}
        onClose={(event) => props.onClose(event)}
        clases={{paper:classes.drawerPaper}}
        ModalProps={{keepMounted:true}}
      >
      <div
      onClose={(event) => props.onClose(event)}
      >
        <div className={classes.searchField}>
          <TextInput 
            fullWidth={false} label={"商品名を入力"}  multiline={false} onChange={(event)=>inputKeyword(event)} rows={1} value={keyword} type={"text"}
          />
          <IconButton onClick={(e) => searchKeyword(e)}>
            <SearchIcon/>
          </IconButton>
        </div>
        <Divider/>
        <List>
          {menus.map( menu => (
            <ListItem key={menu.id} onClick={(e) => menu.func(e, menu.value)}>
              <ListItemIcon>
                {menu.icon}
              </ListItemIcon>
              <ListItemText primary={menu.label}/>              
            </ListItem>
          ))}
        </List>
          <ListItem button key="logout" onClick={()=> dispatch(signOut())}>
            <ListItemIcon>
               <ExitToAppIcon/>
            </ListItemIcon>
            <ListItemText primary={"Logout"}/>
          </ListItem>
          <Divider />
          <List>
            {filters.map(filter => (
              <ListItem key={filter.id} onClick={(e) => filter.func(e, filter.value) }>
                <ListItemText primary={filter.label} />
              </ListItem>
            ))}
          </List>
      </div>
      </Drawer>
    </nav>
  )
}

export default ClosableDrawer