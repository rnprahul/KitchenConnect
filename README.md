# 🍳 KitchenConnect

> A role-based household kitchen inventory and shopping management web application built with React and Firebase.

KitchenConnect is a household kitchen management application designed to coordinate kitchen inventory and shopping between **Mother, Father, and Admin**.

The application provides dedicated dashboards for each role, allowing users to manage kitchen items, create and track shopping requests, complete purchases, receive real-time notifications, and view purchase history.

---

## ✨ Features

### 👩‍🍳 Mother

- View kitchen items and their availability status
- Search kitchen items
- Add available items to the shopping list
- Send shopping requests to Father
- View personal shopping requests
- Track shopping request status
- Remove pending shopping requests
- View all shopping requests
- View purchase history
- Receive notifications when purchases are completed

### 🛒 Father

- View pending shopping requests
- See requested item details
- See who requested each item
- Mark shopping requests as purchased
- Automatically make purchased kitchen items available again
- Receive notifications for new and removed shopping requests

### 👨‍💼 Admin

- View dashboard statistics
- Manage kitchen items
- Add new kitchen items
- Edit kitchen items
- Delete kitchen items
- Search kitchen items
- View all shopping requests
- View purchase history
- Monitor recent shopping activity
- Receive application notifications

---

## 🔔 Notifications

KitchenConnect includes a role-based real-time notification system.

Notifications are generated for important shopping activities, including:

- 🛒 New shopping requests
- ❌ Removed shopping requests
- ✅ Completed purchases

Notifications are delivered according to the user's role.

The notification system supports:

- Notification count badge
- Notification dropdown
- Real-time notification updates
- Role-based notification filtering
- Clear notifications

---

## 📊 Status System

### Shopping Request Status

| Status | Description |
|---|---|
| 🟡 **Pending** | A shopping request has been created and is waiting to be completed |
| 🟢 **Purchased** | The requested item has been purchased |

### Kitchen Item Status

| Status | Description |
|---|---|
| 🟢 **Available** | The item is currently available in the kitchen |
| 🟡 **Requested** | The item has been added to the shopping list and requested for purchase |

### Request Flow

```text
Available
    ↓
Requested
    ↓
Purchased
    ↓
Available
```

---

## 🔐 Authentication & Security

KitchenConnect uses **Firebase Authentication** together with role-based access control.

### Authentication

- Firebase Email/Password Authentication
- Persistent Firebase authentication sessions
- Automatic authentication state restoration
- Protected routes
- Public route protection
- Automatic role-based dashboard redirection
- Explicit logout functionality

### User Roles

The application supports three roles:

```text
Admin
Mother
Father
```

Each role has its own dashboard and permitted functionality.

### Firestore Security

The application uses custom **Cloud Firestore Security Rules** to control database access.

Security rules restrict:

- User profile access
- Kitchen item creation
- Kitchen item updates
- Kitchen item deletion
- Shopping request creation
- Shopping request updates
- Shopping request deletion
- Notification access
- Notification creation
- Notification deletion

The Firestore rules follow a **deny-by-default** approach for documents that are not explicitly configured.

---

## ⚡ Real-Time Data

KitchenConnect uses Firestore real-time listeners for several parts of the application.

Real-time updates include:

- Kitchen items
- Shopping requests
- Dashboard statistics
- Recent activity
- Purchase history
- Notifications
- Notification counts

This allows changes made by one user to be reflected in other users' dashboards without manually refreshing the application.

---

## 🔎 Search

Responsive search functionality is available on supported pages.

### Desktop

A search field is available in the navigation bar.

### Mobile

A search button opens the mobile search field when required.

Search can be used to quickly find kitchen items on supported pages.

---

## 📱 Responsive Design & PWA

KitchenConnect is designed to work across:

- 💻 Desktop
- 📱 Mobile browsers
- 📲 Installed mobile web applications

The application includes:

- Responsive dashboards
- Responsive tables
- Mobile navigation
- Mobile search
- Sticky navigation
- Mobile-friendly buttons
- Installable web app support
- Standalone app display mode
- Application icon
- Custom loading screen

The application includes a web app manifest and can be installed from supported browsers.

---

## 🧭 Navigation

The **KitchenConnect** name in the navigation bar acts as a shortcut to the current user's dashboard.

```text
Admin   → /admin
Mother  → /mother
Father  → /father
```

This allows users to quickly return to their dashboard from other pages.

---

## 🗂️ Application Routes

### Public

```text
/
```

The login page is protected by `PublicRoute` so authenticated users are redirected to their appropriate dashboard.

### Admin

```text
/admin
/admin/items
/admin/requests
/admin/history
```

### Mother

```text
/mother
/mother/requests
/mother/all-requests
/mother/history
```

### Father

```text
/father
```

All role-specific pages are protected using `ProtectedRoute`.

A dedicated `NotFound` page handles unknown routes.

---

## 🗄️ Firestore Collections

The current application uses the following Firestore collections:

```text
users
items
shoppingRequests
notifications
```

### `users`

Stores application user profiles and their roles.

```text
Admin
Mother
Father
```

### `items`

Stores kitchen inventory items and their current availability status.

### `shoppingRequests`

Stores shopping requests, request status, requester information, timestamps, and purchase information.

### `notifications`

Stores role-specific application notifications.

---

## 🔄 Application Workflow

The main shopping workflow works as follows:

```text
Mother
   │
   │ Selects an Available item
   ▼
Shopping Request Created
   │
   ├── Admin notified
   └── Father notified
   │
   ▼
Kitchen Item → Requested
   │
   ▼
Father sees Pending Request
   │
   │ Purchases item
   ▼
Shopping Request → Purchased
   │
   ├── Admin notified
   └── Mother notified
   │
   ▼
Kitchen Item → Available
```

If Mother removes a pending request:

```text
Pending Request
      │
      │ Mother removes request
      ▼
Request Deleted
      │
      ▼
Kitchen Item → Available
      │
      ├── Admin notified
      └── Father notified
```

---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Bootstrap
- Bootstrap Icons
- React Toastify

### Backend & Cloud Services

- Firebase Authentication
- Cloud Firestore
- Firebase Hosting

### Development Tools

- JavaScript
- Git
- GitHub
- VS Code

---

## 📁 Project Structure

```text
KitchenConnect/
│
├── public/
│   ├── favicon.png
│   ├── icons.svg
│   └── manifest.json
│
├── src/
│   │
│   ├── assets/
│   │   └── images/
│   │       └── logo.png
│   │
│   ├── components/
│   │   │
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   │
│   │   ├── common/
│   │   │   ├── Loader.jsx
│   │   │   └── StatusBadge.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── PendingRequestModal.jsx
│   │   │
│   │   ├── items/
│   │   │   ├── DeleteItemModal.jsx
│   │   │   ├── ItemFormModal.jsx
│   │   │   └── ItemTable.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NotificationDropdown.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   └── requests/
│   │       ├── DeleteRequestModal.jsx
│   │       ├── RequestFormModal.jsx
│   │       └── RequestTable.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── firebase/
│   │   ├── firebase.js
│   │   ├── auth.js
│   │   └── firestore.js
│   │
│   ├── pages/
│   │   │
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── KitchenItems.jsx
│   │   │   ├── ShoppingRequests.jsx
│   │   │   └── PurchaseHistory.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Login.css
│   │   │
│   │   ├── father/
│   │   │   ├── Dashboard.jsx
│   │   │   └── ShoppingRequests.jsx
│   │   │
│   │   ├── mother/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ShoppingRequests.jsx
│   │   │   ├── AllRequests.jsx
│   │   │   └── PurchaseHistory.jsx
│   │   │
│   │   └── NotFound.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── itemService.js
│   │   ├── notificationService.js
│   │   └── requestService.js
│   │
│   ├── styles/
│   │   ├── animations.css
│   │   └── dashboard.css
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── firebase.json
├── firestore.rules
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Navigate to the project

```bash
cd kitchenconnect
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure Firebase

Create and configure a Firebase project with:

- Firebase Authentication
- Cloud Firestore
- Firebase Hosting

Configure the required Firebase environment variables before running the application.

### 5. Start the development server

```bash
npm run dev
```

---

## 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Deploy the application and Firebase resources:

```bash
npm run deploy
```

The `deploy` script runs:

```text
npm run build
      ↓
firebase deploy
```

Firestore security rules can also be deployed separately:

```bash
firebase deploy --only firestore:rules
```

---

## 🔒 Firestore Security Rules

Firestore security rules are maintained in:

```text
firestore.rules
```

Before deploying rule changes, validate them with:

```bash
firebase deploy --only firestore:rules --dry-run
```

The application uses role-based Firestore access for:

- Admin
- Mother
- Father

Unauthorized Firestore operations are denied by the security rules.

---

## 👥 Application Roles

KitchenConnect is designed for three household roles:

```text
👨‍💼 Admin
│
├── Manage kitchen items
├── Monitor requests
├── View purchase history
└── Monitor application activity

👩‍🍳 Mother
│
├── Request kitchen items
├── Track requests
├── Remove pending requests
└── View purchase history

🛒 Father
│
├── View pending requests
├── Complete shopping
└── Update purchased items
```

---

## 🎯 Project Goals

KitchenConnect was built to demonstrate practical implementation of:

- Role-based authentication
- Protected React routes
- Public route handling
- Firebase Authentication
- Cloud Firestore
- Firestore Security Rules
- Real-time Firestore listeners
- CRUD operations
- Shopping request workflows
- Role-based notifications
- Responsive UI design
- Progressive Web App capabilities
- Firebase Hosting deployment
- Git and GitHub version control

---

## 👨‍💻 Developer

**Rahul N P**

Built with ❤️ using React and Firebase.

---

## 📄 License

This project is intended as a personal and portfolio project.
