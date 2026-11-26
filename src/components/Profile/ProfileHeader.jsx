import ProfileAvatar from './ProfileAvatar'

export default function ProfileHeader({ user }) {
    return (
        <header className="profile-header">
            <ProfileAvatar user={user} />

            <div className="profile-info">
                <h1>{user.username}</h1>
            </div>
        </header>
    )
}