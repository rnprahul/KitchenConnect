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

const itemsCollection = collection(db, "items");

// Add Item
export const addItem = async (itemData) => {
  await addDoc(itemsCollection, {
    ...itemData,

    status: "Available",

    createdAt: serverTimestamp(),
  });
};

// Get All Items
export const getItems = async () => {
  const q = query(
    itemsCollection,
    orderBy("name")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Update Item
export const updateItem = async (id, itemData) => {
  const itemRef = doc(db, "items", id);

  await updateDoc(itemRef, itemData);
};

// Delete Item
export const deleteItem = async (id) => {
  const itemRef = doc(db, "items", id);

  await deleteDoc(itemRef);
};

// Count Out of Stock Items
export const getOutOfStockItems = async () => {
  const snapshot = await getDocs(itemsCollection);

  return snapshot.docs.filter(
    (doc) => doc.data().status === "Out of Stock"
  ).length;
};

// Update Item Status
export const updateItemStatus = async (id, status) => {
  const itemRef = doc(db, "items", id);

  await updateDoc(itemRef, {
    status,
  });
};

// Total Kitchen Items
export const getItemsCount = async () => {
  const items = await getItems();

  return items.length;
};

// Live Kitchen Item Count
export const subscribeToItemsCount = (callback) => {
  return onSnapshot(itemsCollection, (snapshot) => {
    callback(snapshot.size);
  });
};

// Live Kitchen Items
export const subscribeToItems = (callback) => {
  const q = query(
    itemsCollection,
    orderBy("name")
  );

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(items);
  });
};