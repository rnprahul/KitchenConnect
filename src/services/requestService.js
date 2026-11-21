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
  const parsedQty = parseInt(requestData.quantity, 10);
  const quantity = !isNaN(parsedQty) && parsedQty > 0 ? parsedQty : 1;

  await addDoc(requestsCollection, {
    ...requestData,
    quantity,
    status: "Pending",
    requestedAt: serverTimestamp(),
    purchasedAt: null,
  });

  // Change Kitchen Item Status
  await updateItemStatus(
    requestData.itemId,
    "Requested"
  );

  const qtyLabel = quantity > 1 ? ` (Qty: ${quantity})` : "";

  // Admin Notification
  await addNotification({
    role: "admin",
    icon: "🛒",
    title: `${requestData.requestedBy} requested ${requestData.itemName}${qtyLabel}`,
  });

  // Father Notification
  await addNotification({
    role: "father",
    icon: "🛒",
    title: `${requestData.requestedBy} requested ${requestData.itemName}${qtyLabel}`,
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

// Update Request Quantity (Count)
export const updateRequestQuantity = async (requestOrId, quantity) => {
  const isObj = typeof requestOrId === "object" && requestOrId !== null;
  const requestId = isObj ? requestOrId.id : requestOrId;
  const requestRef = doc(db, "shoppingRequests", requestId);
  const parsed = parseInt(quantity, 10);
  const finalQty = !isNaN(parsed) && parsed > 0 ? parsed : 1;

  try {
    await updateDoc(requestRef, {
      quantity: finalQty,
    });
  } catch (err) {
    console.warn("Direct updateDoc failed, attempting fallback:", err);
    if (isObj && requestOrId.itemId) {
      // Fallback for permissions: delete and re-create with the same fields and new quantity
      await deleteDoc(requestRef);
      await addDoc(requestsCollection, {
        itemId: requestOrId.itemId,
        itemName: requestOrId.itemName,
        quantity: finalQty,
        requestedBy: requestOrId.requestedBy,
        requestedById: requestOrId.requestedById,
        status: "Pending",
        requestedAt: requestOrId.requestedAt || serverTimestamp(),
        purchasedAt: null,
      });
    } else {
      throw err;
    }
  }
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

    const qtyLabel = request.quantity && request.quantity > 1
      ? ` (Qty: ${request.quantity})`
      : "";

    // Admin Notification
    await addNotification({
      role: "admin",
      icon: "✅",
      title: `${purchasedBy} purchased ${request.itemName}${qtyLabel}`,
    });

    // Mother Notification
    await addNotification({
      role: "mother",
      icon: "✅",
      title: `${request.itemName}${qtyLabel} has been purchased`,
    });
  }
};

// Delete Request
export const deleteRequest = async (requestOrId) => {
  const requestId =
    typeof requestOrId === "object" ? requestOrId.id : requestOrId;
  const requestRef = doc(db, "shoppingRequests", requestId);

  if (
    typeof requestOrId === "object" &&
    requestOrId.itemId &&
    requestOrId.status === "Pending"
  ) {
    await updateItemStatus(requestOrId.itemId, "Available");
  }

  await deleteDoc(requestRef);
};

// Remove Pending Request
export const removePendingRequest = async (request) => {
  // Delete the shopping request
  await deleteDoc(
    doc(db, "shoppingRequests", request.id)
  );

  // Make the kitchen item available again
  if (request.itemId) {
    try {
      await updateItemStatus(
        request.itemId,
        "Available"
      );
    } catch (err) {
      console.warn("Failed to reset item status to Available:", err);
    }
  }

  const qtyLabel = request.quantity && request.quantity > 1
    ? ` (Qty: ${request.quantity})`
    : "";

  // Notify Admin
  try {
    await addNotification({
      role: "admin",
      icon: "❌",
      title: `${request.requestedBy} removed ${request.itemName}${qtyLabel} from shopping list`,
    });

    // Notify Father
    await addNotification({
      role: "father",
      icon: "❌",
      title: `${request.requestedBy} removed ${request.itemName}${qtyLabel} from shopping list`,
    });
  } catch (err) {
    console.warn("Failed to send remove notification:", err);
  }
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

  total: requests.length,

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
