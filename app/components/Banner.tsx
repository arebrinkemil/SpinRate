import { Link } from '@remix-run/react'

export default function Banner({ data }: { data: any }) {
  return (
    <div className='col-span-2 row-span-2 max-h-full bg-black text-white lg:col-span-4 lg:row-span-4 2xl:col-span-6 2xl:row-span-6'>
      <Link to={data.links[2]?.url ?? '#'} className='pointer'>
        <div className='flex max-h-full flex-row items-center'>
          {data.mainImage &&
          data.mainImage.asset &&
          data.mainImage.asset.url ? (
            <img
              src={data.mainImage.asset.url}
              alt={data.header}
              className='aspect-square max-h-full'
            />
          ) : (
            <div className='h-1/4 w-1/4 bg-gray-500'></div>
          )}
          <div className='max-h-full'>
            <h1 className='text-hallon w-full px-8 text-right'>
              THE ALBUM OF THE DAY!
            </h1>
            <div className='px-4'>
              <h2 className='text-4xl'>{data.header}</h2>
              <p className='text-lg'>{data.bodyText}</p>

              <div className='flex flex-row gap-4'>
                {data.links.map((link: any) => (
                  <p key={link.text} className='hover:underline'>
                    {link.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
