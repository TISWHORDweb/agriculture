import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To access route parameters
import axios from "axios";
import DashboardLayout from "../Layout/DashboardLayout";
// import farm from "../../assets/images/pexels-photo-259280.jpeg";
// import farmer from "../../assets/images/pexels-photo-916406.jpeg";
import baseUrl from "../../hook/Network";
// import { decode } from "base-64";
 // Use base-64 to decode

const TestView = () => {
  const { id } = useParams(); // Get the encoded ID from the URL
  // const decodedId = atob(id);
  // const realId = atob(encodedId);
  // Decode the ID
  const base_url = baseUrl()


  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const storedUser = localStorage.getItem('authToken');
        console.log(`${base_url}/farmer/test-request/${id}`);
        
        
        const response = await axios.get(`${base_url}/farmer/test-request/${id}`,  {
          headers: {
            "Authorization": `Bearer ${storedUser}`,
          },
        });
        console.log(response.data.data.land)
        setFarmerData(response.data.data);

      }catch (err) {
        console.error("Error fetching farmer data:", err.response || err);
        setError("Failed to fetch farmer data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerData();
  }, [id]);

console.log(farmerData)

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mt-[40px]">
        {/* Farmer Header */}
        {/* <div
          className="h-64 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${farm})` }}
        ></div> */}

        {/* Profile Section */}
        <div className="relative mt-[10px] flex flex-col items-center">
          <h2 className="text-2xl font-semibold mt-3">{farmerData?.land?.name}</h2>
          <p className="text-gray-500">{farmerData?.land.location?.address}</p>
        </div>

        {/* Farmer Details */}
        <div className="mt-6 space-y-4 text-gray-700">
          <div className="flex justify-between items-center">
            <p>
              <strong>Land Size:{farmerData?.land?.totalArea?.value} {farmerData?.land?.totalArea?.unit}</strong>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="text-white px-2 py-1 rounded-lg bg-green-600">
                {farmerData?.status}
              </span>
            </p>
          </div>
          <div>
            <p>
              <strong>Coordinates:</strong>
            </p>
            <p>Latitude: {farmerData?.land?.location?.coordinates?.latitude}°</p>
            <p>Longitude: {farmerData?.land?.location?.coordinates?.longitude}°</p>
          </div>
          <div className="flex items-center">
          <div>
            <p>
              <strong>Additional note:</strong>
            </p>
            <p className="">
             {farmerData?.additionalNotes}
            </p>
          </div>
          
          </div>
         
        </div>

        {/* Actions Section */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between gap-20">
            <div>
              <form className="grid grid-col gap-10 grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                <label>
                  Nitrogen <br/>
                  <h3><b>0.0 mg/kg</b></h3>
                </label>
                <label>
                  Potassium <br/>
                 <h3><b>0.0</b></h3>
                </label>
                <label>
                  Iron <br/>
                  <h3><b>0.0</b></h3>
                </label>
                <label>
                Manganese
                <br/>
                 <h3><b>0.0</b></h3>
                </label>
                <label>
                Boron <br/>
                  <h3><b>0.0</b></h3>
                </label>
                <label>
                Copper <br/>
                  <h3><b>0.0</b></h3>
                </label>
                <label>
                Zinc <br/>
                  <h3><b>0.0</b></h3>
                </label>
                <label>
                CEC <br/>
                  <h3><b>0.0</b></h3>
                </label>
                <label>
                Organic Matter <br/>
                  <h3><b>0.0</b></h3>
                </label>
                <label>
                C/N <br/>
                  <h3><b>0.0</b></h3>
                </label>
                <label>
                Texture <br/>
                <h3><b>0.0</b></h3>
                </label>
                <label>
                Source <br/>
                <h3><b>0.0</b></h3>
                </label>
               </form>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TestView;
