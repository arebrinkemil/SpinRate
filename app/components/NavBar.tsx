import { Form, Link } from '@remix-run/react'
import { GrLogin, GrLogout } from 'react-icons/gr'

interface NavBarProps {
  userId: string | null
}

export const NavBar: React.FC<NavBarProps> = ({ userId }) => {
  return (
    <>
      <div className='box-border flex items-center justify-between bg-black px-8 py-4'>
        <Link to='/' className='block w-1/3 leading-3'>
          <div className='text-platinum text-4xl font-black'>SpinRate</div>
          <div className='text-gray'>Rate music</div>
        </Link>
        <div className='flex items-center gap-6'></div>
        <div className='flex w-1/3 justify-center'>
          {userId ? (
            <Link to={`/profile/${userId}`} className='block text-center'>
              <h2 className='text-2xl text-white'>PROFILE</h2>
            </Link>
          ) : (
            <></>
          )}
        </div>
        <div className='flex w-1/3 justify-end'>
          {userId ? (
            <form method='post' action='/logout'>
              <button className='flex flex-col items-center'>
                <GrLogout color='white' size={40} />
              </button>
            </form>
          ) : (
            <Link to='/login' className='block text-center'>
              <button className='flex flex-col items-center'>
                <GrLogin color='white' size={40} />
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
