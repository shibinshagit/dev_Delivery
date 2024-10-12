import React, { useEffect, useState, useRef } from 'react';
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
  const mapRef = useRef(null);
  const directionsRendererRef = useRef(null); // To store the directions renderer
  const directionsServiceRef = useRef(null); // To store the directions service
  const [currentLocation, setCurrentLocation] = useState(null);
  const watchIdRef = useRef(null); // To store the watchPosition ID

  // Open the order details dialog
  const openDialog = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  // Close the order details dialog
  const closeDialog = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  // Fetch orders from API
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

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Get delivery boy's current location and watch for changes
  useEffect(() => {
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );

      // Cleanup on component unmount
      return () => {
        navigator.geolocation.clearWatch(watchIdRef.current);
      };
    }
  }, []);

  // Initialize the map and directions service only once
  useEffect(() => {
    if (currentLocation && !mapRef.current) {
      const mapOptions = {
        center: currentLocation,
        zoom: 14,
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false,
        scaleControl: false,
      };

      // Create the map instance
      mapRef.current = new window.google.maps.Map(document.getElementById('map'), mapOptions);

      // Create the directions service and renderer instances
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        map: mapRef.current,
        suppressMarkers: false,
      });
    }
  }, [currentLocation]);

  // Update the map when the current location or order changes
  useEffect(() => {
    if (currentLocation && orders[currentOrderIndex]?.location && mapRef.current) {
      const destination = {
        lat: orders[currentOrderIndex].location.latitude,
        lng: orders[currentOrderIndex].location.longitude,
      };

      // Update map center to current location
      mapRef.current.setCenter(currentLocation);

      // Fetch and display the route
      directionsServiceRef.current.route(
        {
          origin: currentLocation,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRendererRef.current.setDirections(result);
          } else {
            console.error("Error fetching directions:", result);
          }
        }
      );
    }
  }, [currentLocation, currentOrderIndex, orders]);

  // Update distances and durations to each order when currentLocation changes
  useEffect(() => {
    if (currentLocation && orders.length > 0) {
      const origins = [new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng)];
      const destinations = orders.map((order) => new window.google.maps.LatLng(order.location.latitude, order.location.longitude));

      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins,
          destinations,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === window.google.maps.DistanceMatrixStatus.OK) {
            const updatedOrders = orders.map((order, index) => {
              const element = response.rows[0].elements[index];
              return {
                ...order,
                distance: element.distance ? element.distance.text : 'Unknown',
                duration: element.duration ? element.duration.text : 'Unknown',
                distanceValue: element.distance ? element.distance.value : Infinity,
              };
            });

            // Sort orders by distance
            updatedOrders.sort((a, b) => a.distanceValue - b.distanceValue);

            setOrders(updatedOrders);
          } else {
            console.error('Error fetching distance matrix:', response);
          }
        }
      );
    }
  }, [currentLocation]);

  // Handle the "Next Order" action
  const handleNextOrder = () => {
    if (currentOrderIndex < orders.length - 1) {
      setCurrentOrderIndex(currentOrderIndex + 1);
    }
  };

  // Handle user click from the user list
  const handleUserClick = (index) => {
    setCurrentOrderIndex(index);
  };

  // Handle phone call action
  const handleCall = (phoneNumber) => {
    window.location.href = `tel:+91${phoneNumber}`;
  };

  // Handle image click to expand
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Close the expanded image
  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div id="map" style={{ height: '400px' }} /> {/* Map container */}
      <NextOrderAndCallAction currentOrder={orders[currentOrderIndex]} handleCall={handleCall} />
      <UserList orders={orders} currentOrderIndex={currentOrderIndex} handleUserClick={handleUserClick} />
      <NavigationGuidance
        expanded={expanded}
        setExpanded={setExpanded}
        currentOrder={orders[currentOrderIndex]}
        handleNextOrder={handleNextOrder}
        handleImageClick={handleImageClick}
        selectedImage={selectedImage}
        handleCloseImage={handleCloseImage}
      />
    </div>
  );
}

export default ViewOrder;

/* ... (Other components remain the same, but we'll update the UserList component to display distance and duration) ... */

import { PhoneIcon } from "@heroicons/react/24/outline";
import { Car } from 'lucide-react';

export const UserList = ({ orders, currentOrderIndex, handleUserClick }) => (
  <div className="px-4 pt-2 pb-16">
    <div className="shadow-md p-3 rounded-lg h-60 overflow-y-scroll">
      <div className="text-sm">
        {orders.map((order, index) => (
          <div key={index}>
            <div className="flex items-center py-2 cursor-pointer" onClick={() => handleUserClick(index)}>
              <div className="flex-shrink-0">
                <div className={`rounded-full p-2 ${index === currentOrderIndex ? 'bg-green-500' : 'bg-orange-500'}`}>
                  <Car color='white' />
                </div>
              </div>
              <div className="ml-4">
                <p className={`font-medium ${index === currentOrderIndex ? 'text-green-800' : ''}`}>{order.name}</p>
                <p className={`text-xs text-gray-500 ${index === currentOrderIndex ? 'text-green-500' : ''}`}>
                  Estimated time: {order.duration || 'Unknown'} | Distance: {order.distance || 'Unknown'}
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
);



/* ... (Rest of the components remain unchanged) ... */



import { ArrowLeftOnRectangleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@material-tailwind/react";

export const MapDisplay = ({ mapRef }) => (
    <div className="relative h-2/4 w-full">
      {/* Map and Route Display */}
      <div className="relative h-full w-full">
        <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
      </div>
  
      {/* Top Section */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between p-4 z-20 bg-transparent">
      </div>
    </div>
  );

  export const NextOrderAndCallAction = ({ currentOrder, handleCall }) => (
    <div className="px-4 py-2 text-white">
      {currentOrder && (
        <div className="bg-orange-700 flex items-center justify-between shadow-md p-3 rounded-xl shining-border">
          <div className="flex items-center">
            <img
              src="https://img.pikbest.com/png-images/20240516/scooter-delivery-man-takeway-food-_10566930.png!sw800"
              alt="Driver"
              className="h-12 w-12 rounded-full mr-3"
            />
            <div>
              <p className="font-semibold">{currentOrder.name}</p>
              <p className="text-sm">{currentOrder.estimatedTime || "Unknown km"}</p>
            </div>
          </div>
          <PhoneIcon
            className="h-6 w-6 cursor-pointer"
            onClick={() => handleCall(currentOrder.phone)}
          />
        </div>
      )}
    </div>
  );


export const NavigationGuidance = ({ expanded, setExpanded, currentOrder, handleNextOrder, handleImageClick, selectedImage, handleCloseImage }) => (
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
          {currentOrder.images && currentOrder.images.length > 0 ? (
            <div className="image-container flex justify-center space-x-4">
              {currentOrder.images.map((image, index) => (
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
  );




  