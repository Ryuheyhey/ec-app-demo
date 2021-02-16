import { TableContainer } from '@material-ui/core'
import React, { useCallback, useState, useMemo} from 'react'
import Paper from "@material-ui/core/Paper"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import IconButton from "@material-ui/core/IconButton"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import {makeStyles} from '@material-ui/core'
import { TextInput } from '../UIkit'

const useStyles = makeStyles({
  checkIcon:{
    float: "right"
  },
  
  iconCell: {
    height: 48,
    width: 48
  }
})


const SetSizeArea = (props) => {
  const classes = useStyles()

  const [index, setIndex] = useState(0),
        [size, setSize] = useState(""),
        [quantity, setQuantity] = useState("")
      
  const inputSize = useCallback((event) => {
    setSize(event.target.value)
  }, [setSize]);
      
  const inputQuantity = useCallback((event) => {
    setQuantity(event.target.value)
  }, [setQuantity]);

  const addSize = (index, size, quantity) => {
    if (size === "" || quantity === "") {
      // Required input is blank
      return false
    } else {
      if(index === props.sizes.length){
        // 新規作成の処理
        props.setSizes(prevState => [...prevState, {size: size, quantity: quantity}])
        setIndex(index + 1)
        setSize("")
        setQuantity(0)
      } else {
        // 編集の処理
        const newSizes = props.sizes
        // 選択されてるindex番目のsizesに現在のsize, quantityの値を入れる
        newSizes[index] = {size: size, quantity: quantity}
        props.setSizes(newSizes)
        setIndex(newSizes.length)
        setSize("")
        setQuantity(0)
      }
    }
  }

  const editSize = (index, size, quantity) => {
    setIndex(index)
    setSize(size)
    setQuantity(quantity)
  }

  const deleteSize = (deleteIndex) => {
    const ret = window.confirm("消去しますか？")
    if(!ret) {
      return false
    } else {
      const newSizes = props.sizes.filter((item,i) => i !== deleteIndex)
      props.setSizes(newSizes)
    }
  }

  const memoIndex = useMemo(()=>{
    setIndex(props.sizes.length)
  }, [props.sizes.length])

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>サイズ</TableCell>
              <TableCell>数量</TableCell>
              <TableCell className={classes.iconCell} />
              <TableCell className={classes.iconCell} />
            </TableRow>
          </TableHead>
          <TableBody>
            {props.sizes.length > 0 && (
              props.sizes.map((item, i) => (
                <TableRow key={item.size}>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <IconButton className={classes.iconCell}onClick={()=>editSize(i, item.size, item.quantity)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton className={classes.iconCell} onClick={()=>deleteSize(i)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div>
          <TextInput 
            fullWidth={false} label={"サイズ"} multiline={false} required={true} onChange={inputSize} rows={1} value={size} type={"text"}
          />
          <TextInput 
            fullWidth={false} label={"数量"} multiline={false} required={true} onChange={inputQuantity} rows={1} value={quantity} type={"number"}
          />
        </div>
        <IconButton className={classes.checkIcon} onClick={()=> addSize(index, size, quantity)}>
          <CheckCircleIcon />
        </IconButton>
      </TableContainer>
    </div>
  )
}

export default SetSizeArea