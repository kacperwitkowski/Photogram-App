import Discover from "../components/Discover";
import Notification from "../components/Notification";

const MobileNotifications = () => {
  return (
    <div className="flex justify-center flex-col">
      <Notification type="mobile" />
      <Discover />
    </div>
  );
};

export default MobileNotifications;
