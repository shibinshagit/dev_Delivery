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
  const directionsRendererRef = useRef(null); // To store the directions renderer
  const directionsServiceRef = useRef(null); // To store the directions service
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
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
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


