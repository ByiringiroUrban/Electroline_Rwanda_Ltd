
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { notificationsAPI } from '@/lib/api';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'sale' | 'announcement' | 'warning';
}

const NotificationBanner = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationsAPI.getAll();
        if (response.success) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
  };

  const visibleNotifications = notifications.filter(
    notification => !dismissedIds.includes(notification._id)
  );

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="space-y-2">
      {visibleNotifications.map((notification) => (
        <Alert key={notification._id} className={`relative ${
          notification.type === 'sale' ? 'border-green-500 bg-green-50' :
          notification.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
          'border-blue-500 bg-blue-50'
        }`}>
          <AlertDescription className="pr-8">
            <strong>{notification.title}:</strong> {notification.message}
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1 h-6 w-6 p-0"
            onClick={() => handleDismiss(notification._id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Alert>
      ))}
    </div>
  );
};

export default NotificationBanner;
