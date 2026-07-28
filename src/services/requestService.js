import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import db from "../firebase/firestore";
import { addNotification } from "./notificationService";
import { updateItemStatus } from "./itemService";

const requestsCollection = collection(db, "shoppingRequests");

// Add Request
export const addRequest = async (requestData) => {
  await addDoc(requestsCollection, {
    ...requestData,
    status: "Pending",
    requestedAt: serverTimestamp(),
    purchasedAt: null,
  });

  // Change Kitchen Item Status
  await updateItemStatus(
    requestData.itemId,
    "Requested"
  );

  // Admin Notification
  await addNotification({
    role: "admin",
    icon: "🛒",
    title: `${requestData.requestedBy} requested ${requestData.itemName}`,
  });

  // Father Notification
  await addNotification({
    role: "father",
    icon: "🛒",
    title: `${requestData.requestedBy} requested ${requestData.itemName}`,
  });
};

// Get All Requests
export const getRequests = async () => {
  const q = query(
    requestsCollection,
    orderBy("requestedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Update Request
export const updateRequest = async (id, requestData) => {
  const requestRef = doc(db, "shoppingRequests", id);

  await updateDoc(requestRef, requestData);
};

// Mark Purchased
export const markAsPurchased = async (
  id,
  purchasedBy
) => {
  const requestRef = doc(db, "shoppingRequests", id);

  const snapshot = await getDocs(requestsCollection);

  const request = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .find((request) => request.id === id);

  await updateDoc(requestRef, {
    status: "Purchased",
    purchasedAt: serverTimestamp(),
    purchasedBy,
  });

  // Make Kitchen Item Available Again
  if (request) {
    await updateItemStatus(
      request.itemId,
      "Available"
    );

    // Admin Notification
    await addNotification({
      role: "admin",
      icon: "✅",
      title: `${purchasedBy} purchased ${request.itemName}`,
    });

    // Mother Notification
    await addNotification({
      role: "mother",
      icon: "✅",
      title: `${request.itemName} has been purchased`,
    });
  }
};

// Delete Request
export const deleteRequest = async (id) => {
  const requestRef = doc(db, "shoppingRequests", id);

  await deleteDoc(requestRef);
};

// Total Requests
export const getTotalRequests = async () => {
  const snapshot = await getDocs(requestsCollection);

  return snapshot.size;
};

// Pending Requests
export const getPendingRequestsCount = async () => {
  const snapshot = await getDocs(requestsCollection);

  return snapshot.docs.filter(
    (doc) => doc.data().status === "Pending"
  ).length;
};

// Purchased Requests
export const getPurchasedRequestsCount = async () => {
  const snapshot = await getDocs(requestsCollection);

  return snapshot.docs.filter(
    (doc) => doc.data().status === "Purchased"
  ).length;
};

// Recent Requests
export const getRecentRequests = async (limit = 5) => {
  const q = query(
    requestsCollection,
    orderBy("requestedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .slice(0, limit)
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
};

// Get Requests By User
export const getRequestsByUser = async (requestedBy) => {
  const snapshot = await getDocs(requestsCollection);

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter(
      (request) => request.requestedBy === requestedBy
    );
};

// Get Recent Activity
export const getRecentActivity = async () => {
  const q = query(
    requestsCollection,
    orderBy("requestedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Dashboard Statistics
export const getDashboardStats = async () => {
  const requests = await getRequests();

  return {
    pending: requests.filter(
      (request) => request.status === "Pending"
    ).length,

    purchased: requests.filter(
      (request) => request.status === "Purchased"
    ).length,
  };
};

// Purchase History
export const getPurchaseHistory = async () => {
  const q = query(
    requestsCollection,
    orderBy("purchasedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter(
      (request) => request.status === "Purchased"
    );
};

// Live Dashboard Statistics
export const subscribeToDashboardStats = (callback) => {
  return onSnapshot(requestsCollection, (snapshot) => {

    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback({
      pending: requests.filter(
        (request) => request.status === "Pending"
      ).length,

      purchased: requests.filter(
        (request) => request.status === "Purchased"
      ).length,
    });

  });
};

// Live Recent Activity
export const subscribeToRecentActivity = (callback) => {
  const q = query(
    requestsCollection,
    orderBy("requestedAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {

    const activities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(activities);

  });
};

// Live Requests By User
export const subscribeToRequestsByUser = (
  requestedBy,
  callback
) => {
  return onSnapshot(requestsCollection, (snapshot) => {

    const requests = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (request) =>
          request.requestedBy === requestedBy
      );

    callback(requests);

  });
};

// Live All Requests
export const subscribeToRequests = (callback) => {
  const q = query(
    requestsCollection,
    orderBy("requestedAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {

    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(requests);

  });
};

// Live Purchase History
export const subscribeToPurchaseHistory = (callback) => {
  const q = query(
    requestsCollection,
    orderBy("purchasedAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {

    const history = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (request) =>
          request.status === "Purchased"
      );

    callback(history);

  });
};
