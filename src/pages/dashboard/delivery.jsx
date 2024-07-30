import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";

export function UpcomingDelivery() {
  return (
    <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
      <Card>
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="m-0 p-4"
        >
        
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-4 items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/9374/9374926.png"
            alt="Chat"
            className="w-64 h-64 object-cover"
          />
          <Typography variant="h6" color="blue-gray">
            {/* upcoming deliveries. */}
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}

export default UpcomingDelivery;
