import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom"; 
import { BaseUrl } from "@/constants/BaseUrl";
import { StatisticsCard } from "@/widgets/cards";
import { Phone } from "lucide-react";

export function ViewOrder() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const openDialog = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/services/orders/${id}?page=${page}`);
      if (response.status === 200) {
        const users = response.data.users;
        setOrders(users);
        if (users.length === 0) {
          setHasMore(false);
        } else {
          setPage(page + 1);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (status) => {
    try {
      await axios.put(`${BaseUrl}/services/orders/${selectedOrder._id}/status`, { status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id ? { ...order, status } : order
        )
      );
      closeDialog();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="mx-auto mb-20 max-w-screen-lg">
      <InfiniteScroll
        dataLength={orders.length}
        next={fetchOrders}
        hasMore={hasMore}
        loader={
          <div className="text-center py-4">
            <Typography variant="h6">Loading more orders...</Typography>
          </div>
        }
      >
        <div className="orders-grid">
          {orders.map((order, index) => (
            <Card key={index} className="order-card mb-6 shadow-md">
              <StatisticsCard
                color="gray"
                icon={
                  <a href={`tel:+91${order.phone}`}>
                    <Phone className="w-6 h-6 text-white" />
                  </a>
                }
                title={order.name}
                location={order.status}
                type={order.phone}
                footer={
                  <div>
                    <div className="flex justify-between">
                      <Typography className="font-normal text-blue-gray-600">
                        {order.location && typeof order.location === 'object' ? (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${order.location.latitude},${order.location.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2"
                          >
                            <img src='https://cdn-icons-png.flaticon.com/512/2875/2875433.png' alt="Google Maps" className="w-4 h-4" />
                            <Typography>View</Typography>
                          </a>
                        ) : ''}
                      </Typography>
                      
                      <Button onClick={() => openDialog(order)}>
                        {order.status}
                      </Button>
                    </div>

                  
                  </div>
                }
              />
            </Card>
          ))}
        </div>
      </InfiniteScroll>

      {/* Dialog for updating order status */}
      {selectedOrder && (
        <Dialog open={open} handler={closeDialog}>
          <DialogHeader>Update Order Status</DialogHeader> 
          <div className="flex space-x-2 mt-4 justify-center mb-6">
                      <img
                        src="https://i.pinimg.com/236x/63/29/3b/63293b3128f9d0778c27977f374a32cf.jpg"
                        alt="Order image 1"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <img
                        src="https://i.pinimg.com/236x/63/29/3b/63293b3128f9d0778c27977f374a32cf.jpg"
                        alt="Order image 2"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <img
                        src="https://i.pinimg.com/236x/63/29/3b/63293b3128f9d0778c27977f374a32cf.jpg"
                        alt="Order image 3"
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
          <DialogBody>
            <div className="flex gap-4 justify-center items-center">
              
              <Button color="green" onClick={() => handleStatusUpdate("Delivered")}>
                Delivered
              </Button>
              <Button color="red" onClick={() => handleStatusUpdate("Canceled")}>
                Canceled
              </Button>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button onClick={closeDialog}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
}

export default ViewOrder;
