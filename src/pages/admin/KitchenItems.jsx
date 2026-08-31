import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";

import ItemTable from "../../components/items/ItemTable";
import ItemFormModal from "../../components/items/ItemFormModal";
import DeleteItemModal from "../../components/items/DeleteItemModal";

import {
  addItem,
  updateItem,
  deleteItem,
  subscribeToItems,
} from "../../services/itemService";

function KitchenItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");

  // Load Items
  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToItems((itemsData) => {
      setItems(itemsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Add Item
  const handleAddClick = () => {
    setSelectedItem(null);
    setShowFormModal(true);
  };

  // Edit Item
  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowFormModal(true);
  };

  // Save Item
  const handleSave = async (data) => {
    try {
      const exists = items.some(
        (item) =>
          item.name.toLowerCase() === data.name.toLowerCase() &&
          item.id !== selectedItem?.id
      );

      if (exists) {
        toast.warning("Item already exists.");
        return;
      }

      if (selectedItem) {
        await updateItem(selectedItem.id, data);
        toast.success("Kitchen item updated successfully");
      } else {
        await addItem(data);
        toast.success("Kitchen item added successfully");
      }

      setShowFormModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }
  };

  // Delete Item
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      toast.success("Kitchen item deleted successfully");
      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout search={search} setSearch={setSearch}>
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(52, 211, 153, 0.3)" }}>
            <i className="bi bi-basket2 text-emerald"></i>
            <small className="text-emerald fw-semibold" style={{ fontSize: "0.8rem" }}>
              Inventory Management
            </small>
          </div>

          <h2 className="fw-bold text-light mb-1">
            Kitchen Items
          </h2>

          <p className="text-secondary mb-0" style={{ fontSize: "0.95rem" }}>
            Track and manage all pantry items and their stock status.
          </p>
        </div>

        <button
          className="btn btn-success px-4 py-2"
          onClick={handleAddClick}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add New Item
        </button>
      </div>

      {/* Items Table */}
      <ItemTable
        items={filteredItems}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Modals */}
      <ItemFormModal
        show={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
        item={selectedItem}
      />

      <DeleteItemModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedItem(null);
        }}
        onConfirm={handleDelete}
        item={selectedItem}
      />
    </DashboardLayout>
  );
}

export default KitchenItems;