import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { StatisticsCard } from "@/widgets/cards";
import { useMaterialTailwindController } from "@/context";
import { useSelector } from "react-redux";
import axios from "axios";
import { BaseUrl } from "@/constants/BaseUrl";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

export function Home() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const [controller] = useMaterialTailwindController();
  const { searchTerm } = controller;

  const handleViewOrder = (id) => {
    navigate(`/dashboard/viewOrder/${id}`);
  };

  const filteredPoints = points.filter(point =>
    point.point.place.toLowerCase().includes(searchTerm.toLowerCase()) || 
    point.point.mode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!user || !user._id) {
      setLoading(false); // Stop loading if user ID is not available
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/services/deliverypoints/${user._id}`);
        console.log("response:", response.data);
        setPoints(response.data);
      } catch (error) {
        setError("Failed to load points.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="grid gap-y-10 gap-x-6 md:grid-cols-1 md:mx-12 xl:grid-cols-1 xl:mx-12 mt-9">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
          <div key={index} className="w-full p-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="mt-9">
      <div className="mb-20 grid gap-y-10 gap-x-6 md:grid-cols-1 md:mx-12 xl:grid-cols-1 xl:mx-12">
        {filteredPoints.map((point) => (
          <StatisticsCard
            key={point.point._id}
            color="gray"
            icon={<MapPin className="w-6 h-6 text-white" />}
            title={point.point.place}
            value={point.point.mode}
            location={point.point.place}
            type={point.point.mode}
            footer={
              <div>
                <Typography className="font-normal text-green-600">
                  <strong>{'Delivered'}</strong>
                </Typography>
                <Typography className="font-normal text-blue-gray-600">
                  <strong>Orders:</strong> {point.userCount}
                </Typography>
                <div className="flex justify-between">
                  <Typography className="font-normal text-blue-gray-600">
                    <strong>Location:</strong>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(point.point.place)}`}
                       target="_blank" rel="noopener noreferrer" className="text-black-500 hover:underline">View</a>
                  </Typography>
                  {point.point.mode === 'single' && (
                    <a onClick={() => handleViewOrder(point.point._id)} className="text-blue-500 hover:underline">
                      Show Orders
                    </a>
                  )}
                </div>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
