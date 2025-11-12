import { useEffect, useState } from "react"
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
import { useAppContext } from "../contexts/appContext";
import { axiosInstance } from "../axios/axiosInstance";
import { useNavigate } from "react-router";
import { Navbar } from "../components/navbar";


const ProfilePage = ()=>{
    const navigate=useNavigate();
    const {user = {},setAppLoading}= useAppContext();
    const [isDetails,issetDetails]=useState(true);
    const [updateDetails,setUpdateDetails]=useState({
         name: "",
        gender: "",
        role: "",
    })

    const getDetails = async()=>{
      try{
            const resp=await axiosInstance.get("/api/v1/users/details");
            setAppLoading(false)
            console.log(resp);
              setUpdateDetails(resp.data.data.user);
            
        }catch(err){
            setAppLoading(false);
             ErrorToast(`Cannot Get details: ${err.response?.data?.message || err.message}`);
        }
    }

    useEffect(()=>{
        getDetails();
    },[])


    const handleEditDetails = async (e) => {

        e.preventDefault(); // prevent form reload
        setAppLoading(true);
        try {
            const result = await axiosInstance.post("/api/v1/users/details", updateDetails);
            setAppLoading(false);
            if (result.status === 200 && result.data.isSuccess) {
            SuccessToast(result.data.message);
            issetDetails(true);
            navigate("/profile");
            } else {
            ErrorToast(result.data.message);
            }
        } catch (err) {
          setAppLoading(false);
            ErrorToast(`Cannot Edit details: ${err.response?.data?.message || err.message}`);
        }
    };



    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-30 animate-pulse z-0" />
      <div className="absolute bottom-10 right-0 w-72 h-72 bg-purple-400 rounded-full filter blur-3xl opacity-30 animate-pulse z-0" />
      <Navbar />

      <h1 className="text-center text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-purple-500 text-transparent bg-clip-text py-6 drop-shadow-lg z-10 relative">
        Profile Page
      </h1>

      <div className="max-w-2xl mx-auto my-10 p-8 bg-white/60 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <img
            src={user.imageUrl || "https://via.placeholder.com/100"}
            alt="Profile"
            className="mx-auto w-24 h-24 rounded-full shadow-md border-4 border-white"
          />
          <p className="text-lg font-semibold text-emerald-800 mt-2">Welcome, {updateDetails.name}</p>
        </div>

        {isDetails ? (
          <>
            
            <div className="space-y-4 text-gray-800 text-lg font-medium">
              <p><span className="font-bold">Name:</span> {updateDetails.name}</p>
              <p><span className="font-bold">Email:</span> {updateDetails.email}</p>
              <p><span className="font-bold">Gender:</span> {updateDetails.gender}</p>
              <p><span className="font-bold">Role:</span> {updateDetails.role}</p>
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() =>{ issetDetails(false);
                  
                }}
                className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-110 hover:shadow-2xl transition-all duration-300"
                >
                Update Details
              </button>
            </div>
            
          </>
        ) : (
          <form onSubmit={handleEditDetails} className="space-y-5 text-gray-700">
            {["name", "gender", "role"].map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="font-semibold capitalize">{field}</label>
                <input
                  type="text"
                  value={updateDetails[field]}
                  onChange={(e) => setUpdateDetails({ ...updateDetails, [field]: e.target.value })}
                  className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-emerald-400 outline-none shadow-sm"
                  placeholder={`Enter your ${field}`}
                />
              </div>
            ))}

            <div className="flex gap-6 justify-end pt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-xl shadow-md hover:scale-110 transition-all duration-300"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => issetDetails(true)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export {ProfilePage}