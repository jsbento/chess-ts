import type { NextPage } from 'next'
import AuthForm from '@components/users/AuthForm'

const Login: NextPage = () => {
  return (
    <div className='h-1/2 w-full'>
      <AuthForm />
    </div>
  )
}

export default Login