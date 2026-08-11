import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
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
    where("role", "==", role),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

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
    where("role", "==", role),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const count = snapshot.size;

    callback(count);
  });
};

// Clear Notifications
export const clearNotifications = async (role) => {
  const q = query(
    notificationsCollection,
    where("role", "==", role)
  );

  const snapshot = await getDocs(q);

  await Promise.all(
    snapshot.docs.map((notification) =>
      deleteDoc(notification.ref)
    )
  );
};