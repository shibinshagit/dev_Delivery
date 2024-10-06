import React, { useEffect, useState, useRef } from 'react';
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
  const [selectedImage, setSelectedImage] = useState(null); // For expanding image
  const mapRef = useRef(null); // Reference to map container

  const [currentLocation, setCurrentLocation] = useState(null); // For delivery boy's current location

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

  // Get delivery boy's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
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
    window.location.href = `tel:+91${phoneNumber}`;
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    if (currentLocation && orders[currentOrderIndex] && orders[currentOrderIndex].location) {
      const destination = {
        lat: orders[currentOrderIndex].location.latitude,
        lng: orders[currentOrderIndex].location.longitude,
      };
      const map = new window.google.maps.Map(mapRef.current, {
        center: currentLocation,
        zoom: 14,
      });

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      directionsService.route(
        {
          origin: currentLocation,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
          } else {
            console.error("Error fetching directions:", result);
          }
        }
      );
    }
  }, [currentLocation, currentOrderIndex, orders]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      
      <div className="relative h-2/4 w-full">
  {/* Map and Route Display */}
  <div className="relative h-full w-full ">
  <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
  </div>

  {/* Top Section */}
  <div className="absolute top-0 inset-x-0 flex items-center justify-between p-4 z-20 bg-transparent">
  </div>
</div>
  {/* Map to show delivery route */}
 
      {/* Next Order and Call Action */}
      <div className="px-4 py-2 text-white">
        {orders[currentOrderIndex] && (
          <div className="bg-orange-700 flex items-center justify-between shadow-md p-3 rounded-xl shining-border">
            <div className="flex items-center">
              <img
                src="https://img.pikbest.com/png-images/20240516/scooter-delivery-man-takeway-food-_10566930.png!sw800"
                alt="Driver"
                className="h-12 w-12 rounded-full mr-3"
              />
              <div>
                <p className="font-semibold">{orders[currentOrderIndex].name}</p>
                <p className="text-sm">{orders[currentOrderIndex].estimatedTime || "Unknown"}</p>
              </div>
            </div>
            <PhoneIcon
              className="h-6 w-6 cursor-pointer"
              onClick={() => handleCall(orders[currentOrderIndex].phone)}
            />
          </div>
        )}

      
      </div>

      {/* List of Users */}
      <div className="px-4 pt-2 pb-16">
        <div className="shadow-md p-3 rounded-lg h-60 overflow-y-scroll">
          <div className="text-sm">
            {orders.map((order, index) => (
              <div key={index}>
                <div className="flex items-center py-2" onClick={() => handleUserClick(index)}>
                  <div className="flex-shrink-0">
                    <div className={`rounded-full p-2 ${index === currentOrderIndex ? 'bg-green-500' : 'bg-orange-500'}`}>
                      <Car color='white' />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className={`font-medium ${index === currentOrderIndex ? 'text-green-800' : ''}`}>{order.name}</p>
                    <p className={`text-xs text-gray-500 ${index === currentOrderIndex ? 'text-green-500' : ''}`}>
                      Estimated time: {order.estimatedTime || 'Unknown'}
                    </p>
                  </div>
                </div>
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
            <p className="text-sm" onClick={handleNextOrder}>Next</p>
            <p className="text-sm" onClick={() => setExpanded(!expanded)}>Delivered</p>
          </div>
        </div>

        {expanded && (
          <div className="absolute left-0 right-0 bottom-16 bg-white p-4 flex flex-col items-center">
            {/* Expanding Image Section */}
            {orders[currentOrderIndex].images && orders[currentOrderIndex].images.length > 0 ? (
              <div className="image-container flex justify-center space-x-4">
                {orders[currentOrderIndex].images.map((image, index) => (
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
              <div className="image-container flex justify-center gap-3">
                <div className="skeleton-loader w-24 h-24 bg-gray-300 animate-pulse rounded-md" />
                <div className="skeleton-loader w-24 h-24 bg-gray-300 animate-pulse rounded-md" />
                <div className="skeleton-loader w-24 h-24 bg-gray-300 animate-pulse rounded-md" />
              </div>
            )}

            {selectedImage && (
              <div className="zoomed-image-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <img src={selectedImage} alt="Zoomed" className="max-w-full max-h-full" />
                <button className="absolute top-4 right-4 text-white" onClick={handleCloseImage}>Close</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewOrder;
