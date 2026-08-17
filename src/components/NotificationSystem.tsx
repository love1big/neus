import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Info, CheckCircle, ShieldAlert, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type NotificationType = 'info' | 'success' | 'warning' | 'critical';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
}

export const triggerNotification = (type: NotificationType, title: string, message: string, useNativePush: boolean = true) => {
  const event = new CustomEvent('app-notification', {
    detail: { type, title, message, useNativePush }
  });
  window.dispatchEvent(event);
};

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [nativePerm, setNativePerm] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNativePerm(Notification.permission);
    }

    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { type, title, message, useNativePush } = customEvent.detail;
      
      const newNotif: AppNotification = {
        id: Math.random().toString(36).substring(2, 9),
        type,
        title,
        message,
        timestamp: Date.now()
      };

      setNotifications(prev => [newNotif, ...prev].slice(0, 5)); // Keep max 5 toasts

      // Trigger Native Push Notification if requested and permitted
      if (useNativePush && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(title, { body: message, icon: '/favicon.ico' });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            setNativePerm(permission);
            if (permission === 'granted') {
              new Notification(title, { body: message, icon: '/favicon.ico' });
            }
          });
        }
      }
    };

    window.addEventListener('app-notification', handleNotification);
    return () => window.removeEventListener('app-notification', handleNotification);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    // Auto-dismiss after 8 seconds
    const interval = setInterval(() => {
      setNotifications(prev => {
        const now = Date.now();
        return prev.filter(n => now - n.timestamp < 8000);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map(notif => {
          let bgColor = 'bg-[#161b22]';
          let borderColor = 'border-[#30363d]';
          let iconColor = 'text-[#58a6ff]';
          let Icon = Info;

          if (notif.type === 'critical') {
            bgColor = 'bg-[#da3633]/10';
            borderColor = 'border-[#f85149]';
            iconColor = 'text-[#f85149]';
            Icon = ShieldAlert;
          } else if (notif.type === 'warning') {
            bgColor = 'bg-[#d29922]/10';
            borderColor = 'border-[#d29922]';
            iconColor = 'text-[#d29922]';
            Icon = AlertTriangle;
          } else if (notif.type === 'success') {
            bgColor = 'bg-[#238636]/10';
            borderColor = 'border-[#3fb950]';
            iconColor = 'text-[#3fb950]';
            Icon = CheckCircle;
          }

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`pointer-events-auto w-[350px] p-4 rounded-lg border shadow-lg shadow-black/50 flex gap-4 backdrop-blur-md ${bgColor} ${borderColor}`}
            >
              <div className={`mt-0.5 ${iconColor}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] font-bold text-white mb-1">{notif.title}</h4>
                <p className="text-[12px] text-[#8b949e] leading-relaxed">{notif.message}</p>
              </div>
              <button 
                onClick={() => removeNotification(notif.id)}
                className="text-[#8b949e] hover:text-white transition h-fit"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
