import React, { useState } from 'react'
import './PostImageLoader.css'

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { storage } from "./firebase";
import {useStateValue} from './StateProvider'

function PostImageLoader({loaderId, callbackImageUrl}) {
    const [urlImage, setUrlImage] = useState("");
    const [{ user }, dispatch] = useStateValue();

    // Set a variable to keep track of the event "load file".
    // This will allow us to re-load the same image after the first
    // time around the media context was closed
    const [targetValueVar, setTargetValueVar] = useState(null);

    let imagePreviewEmpty =
        <div className='postImageLoader__imagePlaceholder'>
            <AddPhotoAlternateIcon color="action" sx={{ fontSize: 40 }}/>
        </div>
    
    let imagePreviewImage =
        <img src={urlImage} alt="" className='postImageLoader__imageFromUrl'/>

    // Create a random prefix for each image to be stored
    function makeRandomIdPrefix(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result + '_';
    }

    const setImage = (e) => {
        const file = e.target.files[0];
        const randomImagePrefix = makeRandomIdPrefix(8);
        const randomImageName = randomImagePrefix + file.name;
        const ref = storage.ref(`/images/${user.uid}/${randomImageName}`);
        const uploadTask = ref.put(file);

        uploadTask.on('stage_changed', console.log, console.error, () => {
            ref.getDownloadURL()
            .then((url) => {
                // Set URL locally
                setUrlImage(url);

                // Send the URL of the images back to the parent
                callbackImageUrl(url);

                // Reset the target value that was triggered by the change "load-file"
                if (targetValueVar)
                {
                    targetValueVar.target.value = ""
                }
            });
        });
    };

    return (
        <div className='postImageLoader'>
            <input
                type='file'
                accept="image/*"
                style={{display: 'none'}}
                id={loaderId}
                onChange={(e) => {
                    setTargetValueVar(e);
                    setImage(e);
                }}
            />
            <label htmlFor={loaderId}>
                {urlImage === "" && imagePreviewEmpty}
                {urlImage !== "" && imagePreviewImage}
            </label>
        </div>
    )
}

export default PostImageLoader
