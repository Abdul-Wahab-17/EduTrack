import HeroSection from '../components/HeroSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
     
      <HeroSection />
      
      {/* Additional sections */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Learn from the best
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Join millions of learners from around the world already learning on EduLearn.
          </p>
        </div>
        
        {/* Course categories */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              name: 'Business',
              description: 'Develop skills to advance your career',
              icon: '💼',
            },
            {
              name: 'Technology',
              description: 'Stay ahead with the latest tech skills',
              icon: '💻',
            },
            {
              name: 'Personal Development',
              description: 'Grow personally and professionally',
              icon: '🧠',
            },
          ].map((category) => (
            <div key={category.name} className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8 h-full shadow-md hover:shadow-lg transition duration-300">
                <div className="-mt-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white text-xl mx-auto">
                    {category.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-base text-gray-600 text-center">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      
    </div>
  )
}