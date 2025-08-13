import Image from 'next/image';
import { CircleCheckBig } from 'lucide-react';

export default function Page() {

  return (
    <>

      <div className="min-h-screen w-screen flex justify-center items-center px-4 sm:px-6 lg:px-8 py-8">
        {/* Background Images - Responsive */}
        <Image
          className="fixed top-0 z-[-1] w-full h-full object-cover"
          width={1920}
          height={1080}
          src="/curtains-bg.svg"
          alt="Curtains Background effect"
          priority
        />
        <Image
          className="fixed top-0 z-[-1] w-full h-full object-cover"
          width={1920}
          height={1080}
          src="/grid-mesh.svg"
          alt="Grid mesh background"
        />

        {/* Main Card Container */}
        <div className="min-w-full flex flex-col items-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl z-10">

          {/* Title - Responsive */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal 
                        bg-gradient-to-b from-[rgba(255,255,255,1)] 
                        to-[rgba(153,153,153,1)] bg-clip-text text-transparent
                        mb-8 sm:mb-10 md:mb-12 text-center leading-tight">
            Checkout
          </h1>




          <div className="p-3 w-3/4  rounded-3xl
                          flex justify-center items-center">

            <div className='flex justify-around items-center my-10 w-1/2'>
              <CircleCheckBig size={48} className='text-green-600' /> <span className='text-3xl'> Payment Was Successful</span>
            </div>
          </div>

          {/* Additional Mobile Spacing */}
          <div className="h-8 sm:h-0"></div>
        </div>
      </div>
    </>
  );
}