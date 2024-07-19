import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
  ListBulletIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { SkeletonContainer, SkeletonImage, SkeletonParagraph, SkeletonSubtitle, SkeletonTitle } from "@/helpers/skeleton";
import { platformSettingsData, conversationsData, projectsData } from "@/data";

export function Profile() {

  const {id} = useParams()
  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src="https://static.vecteezy.com/system/resources/previews/026/530/210/original/modern-person-icon-user-and-anonymous-icon-vector.jpg"
                alt="bruce-mars"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  Name{id}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  Place
                </Typography>
              </div>
            </div>
            <div className="w-96">
              <Tabs value="app">
                <TabsHeader>
                  <Tab value="app">
                    <UserIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Data
                  </Tab>
                  <Tab value="message">
                    <ListBulletIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                    Orders
                  </Tab>
                  {/* <Tab value="settings">
                    <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Settings
                  </Tab> */}
                </TabsHeader>
              </Tabs>
            </div>
          </div>
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Platform Settings
              </Typography>
              
              <SkeletonContainer>
    <SkeletonTitle />
    <SkeletonSubtitle />
    <SkeletonParagraph />
    <SkeletonParagraph />
    <SkeletonParagraph style={{ width: '75%' }} />
    <SkeletonImage />
  </SkeletonContainer>


            </div>
            
          
          </div>
         
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
