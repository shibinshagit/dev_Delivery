import { PhoneIcon, ArrowLeftOnRectangleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@material-tailwind/react";
import { Car } from 'lucide-react';

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

  export const UserList = ({ orders, currentOrderIndex, handleUserClick }) => (
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




  