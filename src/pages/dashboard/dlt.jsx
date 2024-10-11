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

  // Get delivery boy's current location
 // Get delivery boy's current location and watch for changes
useEffect(() => {
  if (navigator.geolocation) {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(newLocation);
        console.log('currentLocation:', newLocation); // Log updated location
      },
      (error) => {
        console.error("Error getting current location:", error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId); // Cleanup the watcher on component unmount
  }
}, []);


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

  // Display route directions to the current order location
  useEffect(() => {
    if (currentLocation && orders[currentOrderIndex]?.location) {
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
<h1>Latitude: {currentLocation?.lat}</h1>
<h1>Longitude: {currentLocation?.lng}</h1>
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

  </div>
  );
}

export default ViewOrder;
