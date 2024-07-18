import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import axios from 'axios';
import { BaseUrl } from '../constants/BaseUrl';
import { CookingPot } from "lucide-react";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: UsersIcon,
    title: "Total Orders",
    value: "0",
    footer: {
      color: "",
      value: "",
      label: "",
    },
  },
  {
    color: "gray",
    icon: CookingPot,
    title: "Breakfast Orders",
    value: "0",
    footer: {
      color: "",
      value: "",
      label: "",
    },
  },
  {
    color: "gray",
    icon: UserPlusIcon,
    title: "Lunch Orders",
    value: "0",
    footer: {
      color: "",
      value: "",
      label: "",
    },
  },
  {
    color: "gray",
    icon: ChartBarIcon,
    title: "Dinner Orders",
    value: "0",
    footer: {
      color: "",
      value: "",
      label: "",
    },
  },
];

export const fetchStatistics = async (date) => {
  try {
    const response = await axios.get(`${BaseUrl}/api/statistics?date=${date}`);
    if (response.status === 200) {
      const data = response.data;
      statisticsCardsData[0].value = data.totalOrders;
      statisticsCardsData[1].value = data.breakfastOrders;
      statisticsCardsData[2].value = data.lunchOrders;
      statisticsCardsData[3].value = data.dinnerOrders;
    } else {
      throw new Error('Failed to fetch statistics');
    }
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};
