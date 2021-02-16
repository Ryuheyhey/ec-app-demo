import React, { useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { makeStyles } from '@material-ui/styles';
import { storage } from '../../firebase/index';
import ImagePrevew from './ImagePrevew';

const useStyles = makeStyles({
  icon:{
    height:48,
    width:48
  }
})

const ImageArea = (props) => {
  const classes = useStyles()

  const uploadImage = useCallback((event) => {
    const file = event.target.files;
    let blob = new Blob(file, {type: "image/jpeg"})

    // ランダムな文字列を生成して、それをfileNameにする
    const S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N=16;
    const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n) => S[n%S.length]).join('')

    const uploadRef = storage.ref('images').child(fileName);
    const uploadTask = uploadRef.put(blob);

    uploadTask.then(() => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        const newImage = {id:fileName, path:downloadURL};
        props.setImages((prevState => [...prevState,newImage]))
      })
    })
  }, [props.setImages])

  const deleteImage = useCallback( async (id) => {
    const ret = window.confirm("消去しますか？")

    if (!ret) {
      return false
    } else {
      const newImage = props.images.filter(image => image.id !== id)
      props.setImages(newImage)
      return storage.ref('images').child(id).delete()
    }
  }, [props.images])

 return (
  <div>
    <div className="p-grid__list-images">
      {props.images.length > 0 && (
        props.images.map(image => <ImagePrevew delete={deleteImage} id={image.id} path={image.path} key={image.id}/>)
      )}
    </div>
    <div className="u-text-right">
      <span>商品画像を登録する</span>
      <IconButton className={classes.icon}>
        <label>
          <AddPhotoAlternateIcon/>
          <input className="u-display-none" type="file" id="image" onChange={(event)=> uploadImage(event)}/>
        </label>
      </IconButton>
    </div>
  </div>
 )
}

export default ImageArea 