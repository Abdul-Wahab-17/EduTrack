export default function HeroSection() {
    return (
      <div className="relative bg-gray-900">
              
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-40"
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Students learning together"
          />
          <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" aria-hidden="true" />
        </div>
        
      
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Unlock Your Potential
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
            Transform your life through learning. Access world-class education from anywhere, anytime.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300"
            >
              Explore Courses
            </a>
          </div>
          
         
          <div className="mt-16 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-lg max-w-2xl">
            <blockquote className="text-black">
              <p className="text-xl italic">
                "Education is the most powerful weapon which you can use to change the world."
              </p>
              <footer className="mt-4 font-semibold">— Nelson Mandela</footer>
            </blockquote>
          </div>
        </div>
      </div>
    )
  }