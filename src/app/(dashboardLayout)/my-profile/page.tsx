const MyProfilePage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <p className="text-gray-600">
        Welcome to your profile. This page is accessible by all roles (Admin, Doctor, Patient) as a common protected route.
      </p>
      <div className="border rounded-lg p-6 bg-white shadow-sm space-y-2">
        <h2 className="text-xl font-semibold">User details will be displayed here</h2>
        <p className="text-gray-500 text-sm">
          You can integrate API fetching to load user profile data here.
        </p>
      </div>
    </div>
  );
};

export default MyProfilePage;
