import AppRoutes from "./Routes.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <div className="relative min-h-screen text-gray-100 bg-[#0d1117] overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 h-full w-full 
        bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] 
        bg-[size:6rem_4rem]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#00B4D8,transparent)] opacity-20"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <main className="relative z-10 p-6">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
