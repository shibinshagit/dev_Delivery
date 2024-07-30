import axios from 'axios';

const INDEED_API_URL = 'https://api.indeed.com/ads/apisearch';
const API_KEY = 'your_indeed_api_key'; // Replace with your Indeed API key

export const fetchStatistics = async (location = 'kochi', jobTitle = 'software developer') => {
  try {
    const response = await axios.get(INDEED_API_URL, {
      params: {
        publisher: API_KEY,
        q: jobTitle,
        l: location,
        format: 'json',
        v: '2',
      },
    });

    if (response.data.results) {
      return response.data.results.map((job) => ({
        color: "blue",
        icon: UsersIcon, // or any icon you prefer
        title: job.jobtitle,
        value: job.company,
        description: job.snippet,
        location: job.city,
        salary: job.salary || 'Not specified',
        type: job.jobtype || 'Full-time',
        url: job.url,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};
