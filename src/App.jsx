import Woodworking from '@images/Woodworking.png';
import cycling from '@images/cycling.png';
import Travel from '@images/Travel.png';
import Retired from '@images/Retired.png';

const App = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-6 py-16">
    <div className="max-w-4xl mx-auto text-center animate-fadeIn">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        Welcome to <span className="text-blue-600">Klupar.com</span>
      </h1>

      <p className="text-xl text-gray-600 mb-12">
        A calm corner of the internet. Family, projects, and the things we love.
      </p>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <img
          src={Woodworking}
          alt="Woodworking"
          className="rounded-xl shadow-md object-cover w-full h-64"
        />
        <img
          src={cycling}
          alt="Cycling"
          className="rounded-xl shadow-md object-cover w-full h-64"
        />
        <img
          src={Travel}
          alt="Travel"
          className="rounded-xl shadow-md object-cover w-full h-64"
        />
        <img
          src={Retired}
          alt="Retired"
          className="rounded-xl shadow-md object-cover w-full h-64"
        />
      </div>
    </div>
  </div>
);

export default App;

