import React, { useState } from 'react';
import { PhoneIcon, ArrowLeftOnRectangleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { IconButton, Button } from "@material-tailwind/react";
import { Car } from 'lucide-react';

export function Tables() {
  const riders = [
    { name: 'Ramees', estimatedTime: '3 mins' },
    { name: 'Murshid', estimatedTime: '10 mins' },
    { name: 'Favas', address: 'Address, House, Street etc' },
    { name: 'Ali', estimatedTime: '5 mins' },
    { name: 'Sara', estimatedTime: '8 mins' },
    { name: 'Tariq', estimatedTime: '4 mins' },
    { name: 'Nadia', estimatedTime: '6 mins' },
    { name: 'Omar', estimatedTime: '7 mins' },
    { name: 'Zain', estimatedTime: '9 mins' },
    { name: 'Lara', estimatedTime: '2 mins' },
  ];

  const [expanded, setExpanded] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Sample image URLs
  const images = [
   
  ];

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
     <div className="relative h-2/4 w-full">
  {/* Map and Route Display */}
  <div className="relative h-full w-full">
    {/* Darker map background */}
    <div className="absolute inset-0 bg-gray-800"></div> 
  </div>

  {/* Top Section */}
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


      {/* Driver Details and Call Action */}
      <div className="px-4 py-2 text-white">
  <div className="bg-orange-700 flex items-center justify-between shadow-md p-3 rounded-xl shining-border">
    <div className="flex items-center">
      <img src="https://img.pikbest.com/png-images/20240516/scooter-delivery-man-takeway-food-_10566930.png!sw800" alt="Driver" className="h-12 w-12 rounded-full mr-3" />
      <div>
        <p className="font-semibold">Shibin Sha</p>
        <p className="text-sm">2.3 KM</p>
      </div>
    </div>
    <PhoneIcon className="h-6 w-6" />
  </div>

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


      {/* Delivery Stops */}
      <div className="px-4 pt-2 pb-16">
      <div className="shadow-md p-3 rounded-lg h-60 overflow-y-scroll">
        <div className="text-sm">
          {riders.map((rider, index) => (
            <div key={index}>
              {/* Rider Item */}
              <div className="flex items-center py-2">
                <div className="flex-shrink-0">
                  <div className="bg-orange-500 rounded-full p-2">
                   <Car color='white'/>

                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-medium">{rider.name}</p>
                  <p className="text-xs text-gray-500">
                    Estimated time: {rider.estimatedTime || rider.address}
                  </p>
                </div>
              </div>

              {/* Dashed line if not the last item */}
              {index < riders.length - 1 && (
                <div className="ml-3 border-l-2 border-dashed border-orange-500 h-6 my-1"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

      {/* Navigation Guidance */}
      <div className="relative">
      <div
        className={`fixed bottom-0 w-full transition-transform duration-300 ease-in-out `}
      >
        <div
          className="bg-orange-800 shadow-md p-3 h-16 rounded-t-md flex justify-between items-center cursor-pointer font-bold text-white"
         
        >
          <p className="text-sm">Next</p>
          <p className="text-sm"  onClick={() => setExpanded(!expanded)}>Delivered</p>
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

export default Tables;
