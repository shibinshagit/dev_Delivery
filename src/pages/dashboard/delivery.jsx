// ViewOrder.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import * as turf from '@turf/turf';
import { BaseUrl } from '@/constants/BaseUrl';
import { PhoneIcon } from "@heroicons/react/24/outline";
import { Car } from 'lucide-react';

export function ViewOrder() {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const mapRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const deliveryBoyMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const [routesData, setRoutesData] = useState([]); // Store route data
  const [mapLoaded, setMapLoaded] = useState(false);
  const destinationMarkerRef = useRef(null);

  // Map style for dark theme (e.g., Uber-like)
  const mapStyle = [
    // Include the full style array for the dark theme
    // You can get styles from Snazzy Maps or customize your own
    {
      "elementType": "geometry",
      "stylers": [
        { "color": "#212121" }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        { "color": "#757575" }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        { "color": "#212121" }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        { "color": "#757575" }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        { "color": "#9e9e9e" }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        { "color": "#bdbdbd" }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        { "color": "#757575" }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        { "color": "#181818" }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        { "color": "#616161" }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        { "color": "#1b1b1b" }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        { "color": "#2c2c2c" }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        { "color": "#8a8a8a" }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        { "color": "#373737" }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        { "color": "#3c3c3c" }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        { "color": "#4e4e4e" }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        { "color": "#616161" }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        { "color": "#757575" }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        { "color": "#000000" }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        { "color": "#3d3d3d" }
      ]
    }
  ];

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/services/orders/${id}`);
      if (response.status === 200) {
        console.log('userData:', response.data.users);
        setOrders(response.data.users);
      } else {
        console.error("Error fetching orders");
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
      const watchId = navigator.geolocation.watchPosition(
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
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []);

  // Initialize the map once
  useEffect(() => {
    if (currentLocation && !mapLoaded) {
      const mapOptions = {
        center: currentLocation,
        zoom: 14,
        mapTypeControl: false,
        zoomControl: true,
        streetViewControl: false,
        scaleControl: false,
        styles: mapStyle, // Apply the dark theme style
      };

      // Create the map instance
      mapRef.current = new window.google.maps.Map(document.getElementById('map'), mapOptions);

      // Place a marker for the delivery boy with an arrow icon
      deliveryBoyMarkerRef.current = new window.google.maps.Marker({
        position: currentLocation,
        map: mapRef.current,
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 5,
          rotation: 0, // We'll update this to match the heading
          fillColor: '#0000FF',
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: '#FFFFFF',
        },
      });

      setMapLoaded(true);
    }
  }, [currentLocation, mapLoaded]);

  // Fetch initial route data for each order
  useEffect(() => {
    const fetchRoutes = async () => {
      if (currentLocation && orders.length > 0 && routesData.length === 0) {
        console.log('Fetching initial routes');
        const service = new window.google.maps.DirectionsService();
        const routePromises = orders.map((order) => {
          if (!order.location || !order.location.latitude || !order.location.longitude) {
            return Promise.resolve(null); // Skip users without location
          }
          return new Promise((resolve) => {
            service.route(
              {
                origin: currentLocation,
                destination: {
                  lat: order.location.latitude,
                  lng: order.location.longitude,
                },
                travelMode: window.google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                  resolve({
                    orderId: order._id,
                    route: result.routes[0],
                    lastUpdated: Date.now(),
                  });
                } else {
                  console.error('Directions API Error for order ID', order._id, ':', status);
                  resolve(null);
                }
              }
            );
          });
        });

        try {
          const routes = await Promise.all(routePromises);
          const validRoutes = routes.filter((route) => route !== null);
          setRoutesData(validRoutes);
        } catch (error) {
          console.error('Error fetching routes:', error);
        }
      }
    };

    fetchRoutes();
  }, [currentLocation, orders, routesData.length]);

  // Update distances and durations based on current position
  useEffect(() => {
    if (currentLocation && routesData.length > 0) {
      const updatedOrders = orders.map((order) => {
        if (!order.location || !order.location.latitude || !order.location.longitude) {
          // User doesn't have location data
          return {
            ...order,
            distance: 'N/A',
            duration: 'N/A',
            distanceValue: Infinity, // Put at the end when sorting
          };
        }

        const routeData = routesData.find((route) => route.orderId === order._id);
        if (routeData && routeData.route && routeData.route.overview_polyline) {
          const decodedPath = polyline.decode(routeData.route.overview_polyline);

          // Create a LineString from the route
          const routeLine = turf.lineString(decodedPath.map(([lat, lng]) => [lng, lat]));

          // Create a Point from the current location
          const currentPoint = turf.point([currentLocation.lng, currentLocation.lat]);

          // Snap current location to the nearest point on the route
          const snapped = turf.nearestPointOnLine(routeLine, currentPoint);

          // Calculate the remaining distance along the route
          const sliced = turf.lineSlice(
            snapped,
            turf.point(routeLine.geometry.coordinates[routeLine.geometry.coordinates.length - 1]),
            routeLine
          );
          const remainingDistance = turf.length(sliced, { units: 'kilometers' });

          // Estimate remaining time based on average speed
          const averageSpeedKmh = 40; // Adjust as necessary
          const estimatedTimeInMinutes = ((remainingDistance / averageSpeedKmh) * 60).toFixed(0);

          return {
            ...order,
            distance: `${remainingDistance.toFixed(2)} km`,
            duration: `${estimatedTimeInMinutes} mins`,
            distanceValue: remainingDistance * 1000, // in meters
          };
        } else {
          return order;
        }
      });

      // Sort orders by remaining distance
      updatedOrders.sort((a, b) => a.distanceValue - b.distanceValue);

      setOrders(updatedOrders);
    }
  }, [currentLocation, routesData]);

  // Update the map with current position and route
  useEffect(() => {
    if (mapRef.current && currentLocation) {
      // Update delivery boy's marker position and rotation
      if (deliveryBoyMarkerRef.current) {
        deliveryBoyMarkerRef.current.setPosition(currentLocation);

        // Optionally, update the rotation based on movement
        // You can implement logic to calculate heading and set the rotation
      }

      // Draw the route on the map
      const currentOrder = orders[currentOrderIndex];
      if (
        currentOrder &&
        currentOrder.location &&
        currentOrder.location.latitude &&
        currentOrder.location.longitude
      ) {
        const routeData = routesData.find((route) => route.orderId === currentOrder._id);
        if (routeData) {
          const decodedPath = polyline.decode(routeData.route.overview_polyline);
          const routePath = decodedPath.map(([lat, lng]) => ({
            lat,
            lng,
          }));

          if (routePolylineRef.current) {
            routePolylineRef.current.setPath(routePath);
          } else {
            routePolylineRef.current = new window.google.maps.Polyline({
              path: routePath,
              geodesic: true,
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              strokeWeight: 4,
              map: mapRef.current,
            });
          }

          // Remove previous destination marker if it exists
          if (destinationMarkerRef.current) {
            destinationMarkerRef.current.setMap(null);
          }

          // Add destination marker (end point)
          destinationMarkerRef.current = new window.google.maps.Marker({
            position: routePath[routePath.length - 1],
            map: mapRef.current,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // Built-in red dot icon
            },
            title: 'Destination',
          });

          // Fit map to the route bounds for better visibility
          const bounds = new window.google.maps.LatLngBounds();
          routePath.forEach((point) => {
            bounds.extend(point);
          });
          mapRef.current.fitBounds(bounds);
        }
      }
    }
  }, [currentLocation, routesData, currentOrderIndex, orders]);

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

  // Adjusted layout: Map on top, other contents below
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div id="map" className="h-[70%]" /> {/* Map occupies 70% */}
      <div className="h-[30%] overflow-auto">
        <NextOrderAndCallAction currentOrder={orders[currentOrderIndex]} handleCall={handleCall} />
        <UserList
          orders={orders}
          currentOrderIndex={currentOrderIndex}
          handleUserClick={handleUserClick}
        />
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
    </div>
  );
}

export default ViewOrder;




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
            <p className="text-sm">{currentOrder.duration || "Unknown km"}</p>
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

export const UserList = ({ orders, currentOrderIndex, handleUserClick }) => {
  // Separate orders with and without location
  const ordersWithLocation = orders.filter(order => order.distanceValue !== Infinity);
  const ordersWithoutLocation = orders.filter(order => order.distanceValue === Infinity);

  return (
    <div className="px-4 pt-2 pb-16">
      <div className="shadow-md p-3 rounded-lg h-60 overflow-y-scroll">
        <div className="text-sm">
          {/* Orders with location */}
          {ordersWithLocation.map((order, index) => (
            <div key={order._id}>
              <div className="flex items-center py-2 cursor-pointer" onClick={() => handleUserClick(index)}>
                <div className="flex-shrink-0">
                  <div className={`rounded-full p-2 ${index === currentOrderIndex ? 'bg-green-500' : 'bg-orange-500'}`}>
                    <Car color='white' />
                  </div>
                </div>
                <div className="ml-4">
                  <p className={`font-medium ${index === currentOrderIndex ? 'text-green-800' : ''}`}>{order.name}</p>
                  <p className={`text-xs text-gray-500 ${index === currentOrderIndex ? 'text-green-500' : ''}`}>
                    Estimated time: {order.duration} | Distance: {order.distance}
                  </p>
                </div>
              </div>
              {index < ordersWithLocation.length - 1 && (
                <div className="ml-3 border-l-2 border-dashed border-orange-500 h-6 my-1"></div>
              )}
            </div>
          ))}

          {/* Users without location */}
          {ordersWithoutLocation.length > 0 && (
            <div>
              <h3 className="font-bold mt-4">All</h3>
              {ordersWithoutLocation.map((order, index) => (
                <div key={order._id}>
                  <div className="flex items-center py-2">
                    <div className="flex-shrink-0">
                      <div className="rounded-full p-2 bg-gray-500">
                        <Car color='white' />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">{order.name}</p>
                      <div className="flex items-center">
                        <p className="text-xs text-red-500">Location not available</p>
                        <button className="ml-2 text-xs text-blue-500 underline">Add Location</button>
                      </div>
                    </div>
                  </div>
                  {index < ordersWithoutLocation.length - 1 && (
                    <div className="ml-3 border-l-2 border-dashed border-gray-500 h-6 my-1"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const NavigationGuidance = ({
  expanded,
  setExpanded,
  currentOrder,
  handleNextOrder,
  handleImageClick,
  selectedImage,
  handleCloseImage,
}) => (
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
        {currentOrder?.images && currentOrder.images.length > 0 ? (
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
