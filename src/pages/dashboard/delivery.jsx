import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '@/constants/BaseUrl';
import { MapDisplay, NavigationGuidance, NextOrderAndCallAction, UserList } from './components/DeliveryComponents';

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
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapInstance = useRef(null); // Reference for the map instance

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

  // Set up geolocation watcher
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(newLocation);

          // Update map center without making a new API call
          if (mapInstance.current) {
            mapInstance.current.setCenter(newLocation);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );

      // Cleanup function to stop watching location
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Display route directions to the current order location
  useEffect(() => {
    if (currentLocation && orders[currentOrderIndex]?.location) {
      const destination = {
        lat: orders[currentOrderIndex].location.latitude,
        lng: orders[currentOrderIndex].location.longitude,
      };

      // Initialize the map only on first render
      if (!mapInstance.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: currentLocation,
          zoom: 14,
        });
        mapInstance.current = map; // Store the map instance for future updates

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
      } else {
        // Update route when location or order changes
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer();
        directionsRenderer.setMap(mapInstance.current);

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
    }
  }, [currentLocation, currentOrderIndex, orders]);

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

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <MapDisplay mapRef={mapRef} />
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
       <style jsx>{`
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

export default ViewOrder;
