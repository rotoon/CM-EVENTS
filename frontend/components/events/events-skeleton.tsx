export function EventsSkeleton() {
  return (
    <main className='max-w-7xl mx-auto px-4 py-16'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4'>
        <div className='space-y-4'>
          <div className='h-6 w-24 bg-gray-200 animate-pulse border-2 border-neo-black shadow-neo' />
          <div className='h-16 w-64 bg-gray-200 animate-pulse border-4 border-neo-black' />
        </div>
        <div className='h-10 w-32 bg-gray-200 animate-pulse border-4 border-neo-black shadow-neo' />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className='flex flex-col h-[500px] bg-white border-4 border-neo-black shadow-neo overflow-hidden'
          >
            {/* Image placeholder */}
            <div className='h-80 w-full bg-gray-200 animate-pulse border-b-4 border-neo-black' />
            {/* Content placeholder */}
            <div className='p-5 space-y-4'>
              <div className='h-8 w-full bg-gray-200 animate-pulse' />
              <div className='h-4 w-2/3 bg-gray-200 animate-pulse' />
              <div className='mt-auto pt-4 flex justify-between border-t-2 border-gray-100'>
                <div className='h-6 w-16 bg-gray-200 animate-pulse' />
                <div className='h-8 w-8 rounded-full bg-gray-200 animate-pulse' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
