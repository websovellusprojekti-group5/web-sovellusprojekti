import {useState} from 'react'

export default function ProfileAvatar({user}) {
    const [profileImage, setProfileImage] = useState(null)
    const [imageError, setImageError] = useState('')

    function handleImageChange(event) {
        const file = event.target.files?.[0]
        if (!file) return

        setImageError('')

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setImageError('Valitse JPG-, PNG- tai WebP-kuva.')
            return
        }

        if (file.size > 2 * 1024 * 1024) {
            setImageError('Kuvan enimmäiskoko on 2 Mt.')
            return
        }

        const reader = new FileReader()

        reader.onload = () => setProfileImage(reader.result)
        reader.onerror = () => setImageError('Kuvan lukeminen epäonnistui.')
        reader.readAsDataURL(file)
    }
   return (
    <div>
        <div className="profile-avatar">
            {profileImage ? (
                <img src={profileImage} alt="Oma profiilikuva" />
            ) : (
                <span aria-hidden="true">
                    {user.username?.charAt(0).toUpperCase() || '?'}
                </span>
            )}

            <input
                className="profile-image-input"
                id="profile-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                aria-label="Vaihda profiilikuva"
                aria-describedby="profile-image-help profile-image-error"
            />

            <label
                className="profile-image-label"
                htmlFor="profile-image"
                title="Vaihda profiilikuva"
            >
            </label>
        </div>

        <p id="profile-image-error" role="alert">
            {imageError}
        </p>
    </div>
)
}
