import React, {useState} from 'react'
import './ProfileNameInput.css'

function ProfileNameInput({labelText, placeholder, callbackSetter}) {
    const [message, setMessage] = useState(placeholder);

    return (
        <div className='profileNameInput'>
            <span>{labelText}</span>
            <input
                type="text"
                value={message}
                placeholder={placeholder}
                onChange={(e) => {
                    setMessage(e.target.value);
                    callbackSetter(e.target.value);
                }}
            />
        </div>
    )
}

export default ProfileNameInput
