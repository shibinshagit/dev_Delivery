import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
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

  const handleViewOrder = (id) => {
    navigate(`/dashboard/viewOrder/${id}`);
  };

  useEffect(() => {
    if (!user || !user._id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/services/deliverypoints/${user._id}`);
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
    <div className=" px-4 ">
      <div className="bg-white rounded-lg shadow-lg  space-y-4">
        {points.map((point,index) => (
          <div key={point.point._id} className={`flex items-start p-4 text-white rounded-lg ${index===0?'shining-border bg-gray-900': 'bg-black'}`}>
            <MapPin className="w-6 h-6 text-orange-600 mr-3 mt-1" />
            <div className="flex-grow">
              <Typography className="font-semibold text-lg">{point.point.place}</Typography>
              <Typography className="text-sm ">{point.point.mode}</Typography>
              {/* <Typography className="font-normal text-blue-gray-600 mt-2">
                <strong>Location:</strong>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(point.point.place)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline ml-1"
                >
                  View
                </a>
              </Typography> */}
            </div>
            <div className="ml-4 text-right">
              <Typography className="font-normal text-green-600">
                <strong>Delivered</strong>
              </Typography>
              <Typography className="font-normal text-blue-gray-600">
                <strong>Orders:</strong> {point.userCount}
              </Typography>
              {point.point.mode === 'single' && (
                <a onClick={() => handleViewOrder(point.point._id)} className="ext-blue-gray-600 hover:underline mt-2 block">
                  Show Orders
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .shining-border {
          position: relative;
          overflow: hidden;
        }

        .shining-border::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(255, 255, 255, 0.5) 50%, 
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-100%);
          animation: shine 2s infinite;
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
