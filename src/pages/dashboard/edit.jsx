import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";

export function Profile() {
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
            src="https://i.pinimg.com/736x/1d/f7/96/1df796d0170ca6f3e273e22d1b69f4d4.jpg"
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

export default Profile;
