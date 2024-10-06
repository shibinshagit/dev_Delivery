import React, { useEffect, useState } from 'react';
import { PhoneIcon, ArrowLeftOnRectangleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@material-tailwind/react";
import { Car } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '@/constants/BaseUrl';

export function ViewOrder() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
        if (users.length === 0) {
          setHasMore(false);
        } else {
          setOrders((prevOrders) => [...prevOrders, ...users]);
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

  const handleNextOrder = () => {
    if (currentOrderIndex < orders.length - 1) {
      setCurrentOrderIndex(currentOrderIndex + 1);
    }
  };

  const handleUserClick = (index) => {
    setCurrentOrderIndex(index);
  };

  const handleCall = (phoneNumber) => {
    // Use tel: protocol to initiate a call
    window.location.href = `tel:+91${phoneNumber}`;
  };

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

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const images = [
   
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="relative h-2/4 w-full">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-gray-800"></div> 
        </div>

        <div className="absolute top-0 inset-x-0 flex items-center justify-between p-4 z-20 bg-transparent">
          <IconButton variant="text">
            <ArrowLeftOnRectangleIcon className="h-6 w-6 text-gray-200" />
          </IconButton>
          <span className="text-lg font-semibold text-gray-200">Order Tracking</span>
          <IconButton variant="text">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-200" />
          </IconButton>
        </div>
      </div>

      {/* Next Order and Call Action */}
      <div className="px-4 py-2 text-white">
        {orders[currentOrderIndex] && (
          <div className="bg-orange-700 flex items-center justify-between shadow-md p-3 rounded-xl shining-border">
            <div className="flex items-center">

                        {orders[currentOrderIndex].location && typeof orders[currentOrderIndex].location === 'object' ? (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${orders[currentOrderIndex].location.latitude},${orders[currentOrderIndex].location.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img src="https://img.pikbest.com/png-images/20240516/scooter-delivery-man-takeway-food-_10566930.png!sw800" alt="Driver" className="h-12 w-12 rounded-full mr-3" />
                          </a>
                          
                        ) :  <img src="https://img.pikbest.com/png-images/20240516/scooter-delivery-man-takeway-food-_10566930.png!sw800" alt="Driver" className="h-12 w-12 rounded-full mr-3" />}

             
              <div>
                <p className="font-semibold">{orders[currentOrderIndex].name}</p>
                <p className="text-sm">{orders[currentOrderIndex].estimatedTime || "Unknown"}</p>
              </div>
            </div>
            <PhoneIcon
              className="h-6 w-6 cursor-pointer"
              onClick={() => handleCall(orders[currentOrderIndex].phone)} // Call icon click
            />
          </div>
        )}

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

      {/* List of Users */}
      <div className="px-4 pt-2 pb-16">
        <div className="shadow-md p-3 rounded-lg h-60 overflow-y-scroll">
          <div className="text-sm">
            {orders.map((order, index) => (
              <div key={index}>
                <div className={`flex items-center py-2`} onClick={() => handleUserClick(index)}> {/* Highlight current order */}
                  <div className="flex-shrink-0">
                    <div className={`rounded-full p-2 ${index === currentOrderIndex ? 'bg-green-500' : 'bg-orange-500'}`}>
                      <Car color='white'/>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className={`font-medium ${index === currentOrderIndex ? 'text-green-800' : ''}`}>{order.name}</p>
                    <p className={`text-xs text-gray-500 ${index === currentOrderIndex ? 'text-green-500' : ''}`}>
                      Estimated time: {order.estimatedTime || 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Dashed line if not the last item */}
                {index < orders.length - 1 && (
                  <div className="ml-3 border-l-2 border-dashed border-orange-500 h-6 my-1"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Guidance */}
      <div className="relative">
        <div className="fixed bottom-0 w-full transition-transform duration-300 ease-in-out">
          <div className="bg-orange-800 shadow-md p-3 h-16 rounded-t-md flex justify-between items-center cursor-pointer font-bold text-white">
            <p className="text-sm" onClick={handleNextOrder}>Next</p> {/* Only click text to trigger next */}
            <p className="text-sm" onClick={() => setExpanded(!expanded)}>Delivered</p> {/* Expandable delivery section */}
          </div>
        </div>

        {expanded && (
        <div className="absolute left-0 right-0 bottom-16 bg-white p-4 flex flex-col items-center">      
          {images.length > 0 ? (
            <div className="image-container flex justify-center space-x-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Delivery ${index}`}
                  className="w-24 h-24 cursor-pointer"
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
          ) : (
            <div className="image-container flex justify-center gap-3"><style jsx>{`
              .skeleton-loader {
                position: relative;
                overflow: hidden;
              }
      
              .skeleton-loader::before {
                content: '';
                position: absolute;
                top: -100%;
                left: -100%;
                width: 300%;
                height: 300%;
                background: linear-gradient(
                  90deg,
                  rgba(255, 255, 255, 0.5) 0%,
                  rgba(255, 255, 255, 0) 50%,
                  rgba(255, 255, 255, 0.5) 100%
                );
                animation: shine 1.5s infinite;
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
              <div className="skeleton-loader w-24 h-24 bg-gray-300 animate-pulse rounded-md" />
            <div className="skeleton-loader w-24 h-24 bg-gray-300 animate-pulse rounded-md" />
            <div className="skeleton-loader w-24 h-24 bg-gray-300 animate-pulse rounded-md" />
          </div>
          )}

          {selectedImage && (
            <div className="zoomed-image-overlay fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-30">
              <div className="relative">
                <img src={selectedImage} alt="Zoomed" className="max-w-full max-h-full" />
                <button className="absolute top-0 right-0 p-2 text-white" onClick={handleCloseImage}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

export default ViewOrder;
