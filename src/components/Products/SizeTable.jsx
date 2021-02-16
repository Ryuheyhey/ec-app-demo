import { TableContainer } from '@material-ui/core'
import React, { useCallback, useState, useMemo} from 'react'
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
import IconButton from "@material-ui/core/IconButton"
import {makeStyles} from '@material-ui/core'
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"

const useStyles = makeStyles({
  iconCell:{
    padding:0,
    width:48,
    height:48
  }
})

const SizeTable = (props) => {
  
  const classes = useStyles();
  
  const sizes = props.sizes

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {sizes.length > 0 && (
            sizes.map(size => (
              <TableRow key={size.size}>
                <TableCell>
                  {size.size}
                </TableCell>
                <TableCell>
                 残り {size.quantity}点
                </TableCell>
                <TableCell className={classes.iconCell}>
                  {size.quantity > 0 ? (
                    <IconButton 
                    className={classes.iconCell}
                    onClick={()=> props.addProduct(size.size)}
                    >
                      <ShoppingCartIcon />
                    </IconButton>
                  ) : (
                    <div>売切</div>
                  )}
                </TableCell>
                <TableCell className={classes.iconCell}>
                  <IconButton onClick={()=> props.addLikes(size.size)}>
                  <FavoriteBorderIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )

}

export default SizeTable