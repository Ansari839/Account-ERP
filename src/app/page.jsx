import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold mb-8">Welcome to the App</h1>
      <Link href="/dashboard" className="px-6 py-3 bg-blue-500 text-white rounded-md text-lg">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default LandingPage;