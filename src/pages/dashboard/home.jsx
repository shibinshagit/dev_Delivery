import React, { useState, useEffect } from "react";
import {
  Typography,
} from "@material-tailwind/react";
import { StatisticsCard } from "@/widgets/cards";
import { statisticsCardsData } from "@/data";
import { useMaterialTailwindController } from "@/context";
// import { fetchStatistics } from "@/data";

export function Home() {
  // const [statisticsCardsData, setStatisticsCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [controller] = useMaterialTailwindController();
  const {searchTerm}= controller

  const filteredUsers = statisticsCardsData.filter(user =>
    user.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.value.toLowerCase().includes(searchTerm.toLowerCase())
  );



  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const data = await fetchStatistics();
        // setStatisticsCardsData(statisticsCardsData);
    //     setLoading(false);
    //   } catch (error) {
    //     setError("Failed to load job data.");
        setLoading(false);
    //   }
    // };

    // fetchData();
  }, [statisticsCardsData]);

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
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-1 md:mx-12 xl:grid-cols-1 xl:mx-12">
        {filteredUsers.map(({ icon, title, value, description, location, salary, type, url }) => (
          <StatisticsCard
            key={title}
            color="gray"
            icon={React.createElement(icon, { className: "w-6 h-6 text-white" })}
            title={title}
            value={value}
            description={description}
            location={location}
            salary={salary}
            type={type}
            footer={
              <div>
                <Typography className="font-normal text-blue-gray-600">
           <strong>{value}</strong>
                </Typography>
                <Typography className="font-normal text-blue-gray-600">
                {description}
                </Typography>
                <Typography className="font-normal text-blue-gray-600">
                  <strong>Salary:</strong> {salary}
                </Typography>
               <div className="flex justify-between">
               <Typography className="font-normal text-blue-gray-600">
                  <strong>Location:</strong> {location}
                </Typography>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Apply Now
                </a>
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
