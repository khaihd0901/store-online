import { useAuthStore } from '@/stores/authStore'
const Profile = () => {
    const {user} = useAuthStore();
  return (
    <div>{user.email}</div>
  )
}

export default Profile