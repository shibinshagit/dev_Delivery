import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  fetchStatistics,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCcw } from "lucide-react";
import { fetchCostomers } from "@/redux/reducers/authSlice";
import { useNavigate } from "react-router-dom";

export function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customers = useSelector((state) => state.auth.customers)
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const updateStatistics = async () => {
      setLoading(true);
      setError("");
      try {
        await fetchStatistics(date.toISOString().split("T")[0], customers);
      } catch (err) { 
        setError("Error fetching statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    updateStatistics();
  }, [date]);

  const handleDateChange = (date) => {
    setDate(date);
  };
  const handleRefresh = () => {
   console.log('hello')
   dispatch(fetchCostomers());
   navigate('/')
   nav
  };

  if (loading) {
    return  <div className="grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4 mt-9">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
      <div key={index} className="w-full p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    ))}
  </div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="mt-9">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-9 flex items-center">
      <RefreshCcw onClick={handleRefresh}/>
        <DatePicker
          selected={date}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="form-control px-3 py-2 border border-blue-gray-300 rounded-md"
          wrapperClassName="w-full"
        />
      </div>
    </div>
  );
}

export default Home;
