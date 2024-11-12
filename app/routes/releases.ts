import { json } from '@remix-run/node'
import { getNewMusic } from './queries'

const AUTH_USERNAME = process.env.AUTH_USERNAME
const AUTH_PASSWORD = process.env.AUTH_PASSWORD

export const loader = async ({ request }: { request: Request }) => {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !isAuthorized(authHeader)) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const newMusic = await getNewMusic()
    if (!newMusic) {
      return json({ error: 'Not Found' }, { status: 404 })
    }

    return json(newMusic)
  } catch (error) {
    console.error('Error in loader:', error)
    return json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 },
    )
  }
}

function isAuthorized(authHeader: string): boolean {
  const encodedCredentials = authHeader.split(' ')[1]
  const decoded = Buffer.from(encodedCredentials, 'base64').toString('utf-8')
  const [username, password] = decoded.split(':')
  return username === AUTH_USERNAME && password === AUTH_PASSWORD
}
