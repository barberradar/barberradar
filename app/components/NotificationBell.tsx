"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading notifications:", error);
        return;
      }

      setNotifications(data || []);
    };

    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const handleNotificationClick = async () => {
    const openingNotifications = !showNotifications;
    setShowNotifications(openingNotifications);

    if (!openingNotifications || unreadCount === 0) return;

    const supabase = createClient();

    const unreadIds = notifications
      .filter((notification) => !notification.read)
      .map((notification) => notification.id);

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .in("id", unreadIds);

    if (error) {
      console.error("Error marking notifications as read:", error);
      return;
    }

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  if (!isLoggedIn) return null;

  return (
  <div className="relative flex items-center gap-2">
      <button
        onClick={handleNotificationClick}
        className="relative rounded-full border border-white/20 px-3 py-2 text-xl"
      >
        🔔

        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>
      <button
  onClick={() => (window.location.href = "/bookings")}
  className="rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold whitespace-nowrap"
>
  My Bookings
</button>

      {showNotifications && (
        <div className="absolute right-0 z-50 mt-3 w-80 rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-xl">
          <p className="mb-3 text-sm font-bold text-white">
            Notifications
          </p>

          {notifications.length === 0 ? (
            <p className="text-sm text-zinc-400">
              No notifications yet.
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-xl border border-white/10 bg-black p-3"
                >
                  <p className="text-sm text-zinc-200">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}