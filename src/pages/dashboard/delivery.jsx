import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

// Free API for tech news
const TECH_NEWS_API = "https://newsapi.org/v2/top-headlines?category=technology&apiKey=8a348376e5c945e6845af8ff8cf519b5";

export function Posts() {
  const user = useSelector((state) => state.user); // Get user id from Redux
  const [open, setOpen] = useState(false);
  const [postType, setPostType] = useState(""); // post or jobPost
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [techNews, setTechNews] = useState([]);
  const [page, setPage] = useState(1);

  // Function to handle dialog opening
  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  // Handle form submission for Post/Job Post
  const handlePostSubmit = async () => {
    const data = {
      userId: user.id,
      content: postContent,
      type: postType, // 'post' or 'jobPost'
    };

    try {
      const response = await axios.post("/api/posts", data); // Replace with your actual post API
      setPosts([response.data, ...posts]); // Add new post to the state
      setPostContent("");
      closeDialog();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  // Fetch tech news using a free API with infinite scrolling
  const fetchTechNews = async () => {
    try {
      const response = await axios.get(`${TECH_NEWS_API}&page=${page}`);
      setTechNews([...techNews, ...response.data.articles]);
      setPage(page + 1); // Increment page for next batch of news
    } catch (error) {
      console.error("Error fetching tech news:", error);
    }
  };

  // Initial fetch for tech news
  useEffect(() => {
    fetchTechNews();
  }, []);

  return (
    <div className="mx-auto mb-20 flex max-w-screen-lg flex-col gap-8">
      {/* Add Post Button */}
      <Button color="dark" onClick={openDialog}>Add Post</Button>

      {/* Dialog for selecting post type */}
      <Dialog open={open} handler={closeDialog}>
        <DialogHeader>Select Post Type</DialogHeader>
        <DialogBody>
          <div className="flex gap-4">
            <Button
              color={postType === "post" ? "blue" : "gray"}
              onClick={() => setPostType("post")}
            >
              Regular Post
            </Button>
            <Button
              color={postType === "jobPost" ? "blue" : "gray"}
              onClick={() => setPostType("jobPost")}
            >
              Job Post
            </Button>
          </div>
      
          <Input className="mt-8" variant="standard" label="" value={postContent} placeholder="" onChange={(e) => setPostContent(e.target.value)}/>
        </DialogBody>
        <DialogFooter className="mt-8">
          <Button color="red" className="mx-3" onClick={closeDialog}>
            Cancel
          </Button>
          <Button color="green" onClick={handlePostSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Displaying Tech News with Infinite Scroll */}
      <div className="tech-news-section">
  <Typography variant="h4" className="mb-6">
    Tech News Today
  </Typography>

  <InfiniteScroll
    dataLength={techNews.length} // Length of the news array
    next={fetchTechNews} // Function to fetch more news
    hasMore={true} // Infinite scrolling continues
    loader={
      <div className="text-center py-4">
        <Typography variant="h6">Loading more news...</Typography>
      </div>
    }
  >
    <div className="news-grid">
      {techNews.map((news, index) => (
        <Card key={index} className="news-card mt-8 mb-6 shadow-md">
          <CardHeader className="bg-blue-100 mt-1 p-4">
            <Typography variant="h6" className="font-bold">
              {news.title}
            </Typography>
          </CardHeader>
          <CardBody className="p-4">
            <Typography className="mb-4 text-gray-700">{news.description}</Typography>
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Read more
            </a>
          </CardBody>
        </Card>
      ))}
    </div>
  </InfiniteScroll>
</div>

    </div>
  );
}

export default Posts;
