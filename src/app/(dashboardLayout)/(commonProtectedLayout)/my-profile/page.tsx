import MyProfile from "@/src/components/modules/MyProfile/Myprofile";
import { getMyProfile } from "@/src/services/auth/auth.service";
import { getUserInfo } from "@/src/services/auth/getUserInfo";



const MyProfilePage = async () => {
  // 1. Retrieve the basic user info (name, email, role) decoded from the JWT cookie
  const basicUser = await getUserInfo();
  
  // Return an error message if the user is not authenticated
  if (!basicUser) {
    return (
      <div className="p-6 text-center text-red-500">
        Unauthorized. Please log in.
      </div>
    );
  }

  // 2. Fetch the full, detailed profile details from GET /user/me API endpoint
  const profileResponse = await getMyProfile();
  
  // Merge the basic identity and full API profile data into a single object
  const fullUserInfo = {
    ...basicUser,
    ...profileResponse?.data,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Render the interactive profile editor component */}
      <MyProfile userInfo={fullUserInfo} />
    </div>
  );
};

export default MyProfilePage;
