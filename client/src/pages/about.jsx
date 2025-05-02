import aboutImage from '../assets/about.avif'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()

  const handleStartLearning = () => {
    navigate('/login') // This will redirect to the login page
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
  
      
      <section className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <img 
              src={aboutImage} 
              alt="People learning together" 
              className="rounded-xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
          
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Transform Your Life Through Learning
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              Welcome to <span className="font-semibold text-blue-600">LearnHub</span>, where we believe 
              that education has the power to change lives. Our mission is to provide 
              world-class learning experiences to anyone, anywhere.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Expert Instructors</h3>
                  <p className="text-gray-600">Learn from the best minds in industry and academia</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Flexible Learning</h3>
                  <p className="text-gray-600">Study at your own pace, on your schedule</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Career Advancement</h3>
                  <p className="text-gray-600">Gain skills that employers value</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleStartLearning}
              className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
            >
              Start Learning Today
            </button>
          </div>
        </div>
        
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Impact</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join over <span className="font-bold text-blue-600">10 million</span> learners worldwide who have transformed their careers and lives through our platform.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-5xl font-bold text-blue-600 mb-2">98%</h3>
              <p className="text-gray-600">Career improvement rate</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-5xl font-bold text-blue-600 mb-2">4.8/5</h3>
              <p className="text-gray-600">Average course rating</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-5xl font-bold text-blue-600 mb-2">5000+</h3>
              <p className="text-gray-600">Courses available</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;