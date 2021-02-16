import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/styles';
import AppBar from "@material-ui/core/AppBAr"
import ToolBar from "@material-ui/core/ToolBAr"
import logo from '../../assets/img/icons/logo.png'
// import Dubl286UcAA_WMu from '../../assets/img/icons/Dubl286UcAA_WMu.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { getIsSignedIn } from '../../reducks/users/selectors';
import {push} from "connected-react-router"
import {HeaderMenus,ClosableDrower} from "./index"

const useStyles = makeStyles({
  root:{
    flexGrow: 1
  },
  menuBar:{
    backgroundColor:'#fff',
    color:'#444'
  },
  toolBar: {
    margin:'0 auto',
    maxWidth: 1024,
    width:'100%'
  },
  iconButton:{
    margin:'0 0 0 auto'
  }
})

const Header = () => {
  const classes = useStyles()
  const selector = useSelector((state) => state)
  const isSignedIn = getIsSignedIn(selector)
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)

  const handleDrawerToggle = useCallback((event) => {
    if (event.type === "keydown" && (event.key === 'Tab' || event.key === 'Shift')){
      return
    }
    setOpen(!open)
  }, [setOpen, open])
  
 return (
   <div className={classes.root} >
  <AppBar position="fixed" className={classes.menuBar}>
    <ToolBar className={classes.toolBar}>
      <img src={logo} alt="logo" width="128px" onClick={()=>dispatch(push("/"))}/>
      {isSignedIn && (
      <div className={classes.iconButton}>
      <HeaderMenus handleDrawerToggle={handleDrawerToggle}/>
      </div>
      )}
    </ToolBar>
  </AppBar>
  <ClosableDrower open={open} onClose={handleDrawerToggle} />
   </div>
 )
}

export default Header