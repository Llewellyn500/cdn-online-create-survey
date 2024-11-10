// /path/to/your/LandingPage.tsx
"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const navigateToCreate = () => {
    router.push("/create");
  };

  const navigateToEdit = () => {
    router.push("/edit");
  };

  const navigateToView = () => {
    router.push("/view");
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-8">Welcome to the Survey App</h1>
      <p className="mb-8 text-lg">Please select an action:</p>
      <div className="space-y-4">
        <button
          onClick={navigateToCreate}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-500 transition"
        >
          Create Survey
        </button>
        <button
          onClick={navigateToEdit}
          className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg hover:bg-green-500 transition"
        >
          Edit Survey
        </button>
        <button
          onClick={navigateToView}
          className="px-6 py-3 bg-yellow-600 text-white rounded-lg text-lg hover:bg-yellow-500 transition"
        >
          View Survey
        </button>
      </div>
    </div>
  );
}
