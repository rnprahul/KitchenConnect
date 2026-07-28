import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import db from "../firebase/firestore";

const notificationsCollection = collection(db, "notifications");

// Add Notification
export const addNotification = async ({
  role,
  icon,
  title,
}) => {
  await addDoc(notificationsCollection, {
    role,
    icon,
    title,
    createdAt: serverTimestamp(),
  });
};

// Subscribe Notifications
export const subscribeToNotifications = (
  role,
  callback
) => {
  const q = query(
    notificationsCollection,
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (notification) => notification.role === role
      );

    callback(notifications);
  });
};

// Subscribe Notification Count
export const subscribeToNotificationCount = (
  role,
  callback
) => {
  const q = query(
    notificationsCollection,
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const count = snapshot.docs.filter(
      (doc) => doc.data().role === role
    ).length;

    callback(count);
  });
};

// Clear Notifications
export const clearNotifications = async (role) => {
  const snapshot = await getDocs(notificationsCollection);

  const notifications = snapshot.docs.filter(
    (doc) => doc.data().role === role
  );

  await Promise.all(
    notifications.map((notification) =>
      deleteDoc(notification.ref)
    )
  );
};