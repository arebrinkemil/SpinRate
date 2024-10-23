import { Form, Link } from '@remix-run/react'
import { LoginIcon, LogoutIcon } from '~/icons/icons'

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
        <div className='flex w-1/3 justify-end'>
          {userId ? (
            <form method='post' action='/logout'>
              <button className='block text-center'>
                <LogoutIcon />
                <br />
                <span className='text-gray text-xs font-bold uppercase'>
                  Log out
                </span>
              </button>
            </form>
          ) : (
            <Link to='/login' className='block text-center'>
              <LoginIcon />
              <br />
              <span className='text-gray text-xs font-bold uppercase'>
                Log in
              </span>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
