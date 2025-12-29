import Feature from '@components/Feature';
import Footer from '@components/Footer';
import logo from '@images/logo.png';

const features = [
  {
    title: 'npm run start',
    description: 'Run the React app in development mode with live reloading.',
  },
  {
    title: 'npm run build',
    description: 'Bundles the React app for deployment in production environment.',
  },
  {
    title: 'npm run inline',
    description: 'Inline all CSS and JS in a single minfied file.',
  },
];

const App = () => (
<div className="flex min-h-screen flex-col justify-center bg-gray-50 px-6"> 
  <div className="mx-auto max-w-3xl text-center animate-fadeIn"> 
    <h1 className="text-5xl font-bold text-gray-900 mb-6"> 
      Welcome to <span className="text-blue-600">Klupar.com</span> 
    </h1> 
    
    <p className="text-xl text-gray-600 leading-relaxed mb-10"> 
      A space for projects, ideas, and the things that matter most. Built with intention. Designed for clarity. 
    </p> 
    
    <a href="#" className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition" > 
      Explore 
    </a> 
  </div> 
</div>);

export default App;
