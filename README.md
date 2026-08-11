# 🍳 KitchenConnect

> A role-based household kitchen inventory and shopping management web application.

KitchenConnect helps coordinate household shopping between the kitchen and supermarket by connecting **Mother, Father, and Admin** through dedicated dashboards.

## 🚀 Features

### 👩‍🍳 Mother
- View available kitchen items
- Select items that are out of stock
- Send shopping requests to Father
- Track request status
- Receive purchase completion updates
- View purchase history

### 🛒 Father
- View incoming shopping requests
- Track requested items
- Update shopping status
- Mark purchases as completed

### 👨‍💼 Admin
- Manage kitchen items
- Manage item categories
- Create shopping requests
- Monitor application activity

### 🔐 Authentication & Access Control
- Firebase Authentication
- Role-based access
- Protected routes
- Separate dashboards for each user role

## 📊 Request Status

| Status | Description |
|---|---|
| 🟡 Pending | Request created and waiting for action |
| 🔵 Shopping in Progress | Shopping request is being processed |
| 🟢 Purchase Completed | Requested items have been purchased |

## 🛠️ Tech Stack

- **Frontend:** React, Vite
- **Styling:** Bootstrap, CSS
- **Backend Services:** Firebase
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore
- **Version Control:** Git & GitHub

## 📁 Project Structure

```text
KitchenConnect/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── firebase/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   └── utils/
├── .gitignore
├── firebase.json
├── index.html
├── package.json
└── vite.config.js
