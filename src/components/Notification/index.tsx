import React from "react";

import { toast } from "react-toastify";

import { Icon, Link, RoundLoader, Text } from "@/components";

export interface NotificationProps {
  type?: "success" | "error" | "warn" | "info";
  title?: string;
  message?: string;
  txLink?: string;
}

const Notification = ({ type = "info", title, message, txLink }: NotificationProps) => {
  const container = (
    <div className="space-y-1">
      {title && <Text variant="h5">{title}</Text>}
      <div className="space-y-2">
        {message && (
          <Text variant="sm" className="font-500">
            {message}
          </Text>
        )}
        <div className="flex flex-row items-center space-x-2">
          {type === "warn" && <RoundLoader color="#FFFFFF" visible={true} />}
          {type === "success" && <Icon name="check-circle-fill" color="#25AE88" size={5} />}
          {txLink && (
            <Link path={txLink} external className="flex items-center space-x-1">
              <Text variant="sm" className="font-600">
                View transaction
              </Text>
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  switch (type) {
    case "success":
      return toast.success(container);
    case "warn":
      return toast.warn(container);
    case "error":
      return toast.error(container);
    case "info":
      return toast.info(container);
    default:
      return toast(container);
  }
};

export default Notification;
