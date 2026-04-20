# InvoiceOS — Full Stack Invoice Manager

## Project Structure

```
INVOICE-APP/
├── backend/
│ ├── app.py ← Flask API + PDF generation
│ ├── seed.py ← Seed database with sample invoices
│ ├── database.db ← Auto-created on first run
│ ├── DejaVuSans.ttf ← Font for PDFs
│ └── DejaVuSans-Bold.ttf
├── frontend/
│ ├── src/
│ │ ├── main.jsx
│ │ ├── App.jsx
│ │ ├── index.css
│ │ ├── api/index.js
│ │ ├── context/DarkModeContext.jsx
│ │ ├── components/
│ │ │ ├── Layout.jsx
│ │ │ ├── Sidebar.jsx
│ │ │ ├── Header.jsx
│ │ │ └── InvoiceModal.jsx
│ │ └── pages/
│ │ ├── Dashboard.jsx
│ │ ├── Invoices.jsx
│ │ ├── Customers.jsx
│ │ ├── Products.jsx
│ │ ├── Reports.jsx
│ │ ├── Activity.jsx
│ │ ├── Settings.jsx
│ │ └── Profile.jsx
│ ├── index.html
│ ├── package.json
│ ├── vite.config.js
│ ├── tailwind.config.js
│ └── postcss.config.js
└── README.md
```


## Setup & Run

### Prerequisites
- Python 3.8+
- Node.js 18+
- pip, npm

### 1. Backend Setup

Open a terminal in the **project root** (`INVOICE-APP/`), then:

```bash
cd backend
pip install flask flask-cors fpdf2
```

### 2. Seed the database (optional but recommended)
```bash
python seed.py
# ✅ Done — inserted 20 invoices
```

### 3. Start the backend
```bash
python app.py
# → Running on http://localhost:5000
```

### 4. Install frontend dependencies & start dev server
Open a **new terminal** in the same folder:
```bash
cd frontend
npm install
npm run dev
# → Running on http://localhost:5173
```

### 5. Open the app
Visit **http://localhost:5173** in your browser.

The Vite dev server automatically proxies all `/api/*` requests to Flask on port 5000 — no CORS issues.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | List invoices (paginated, filterable) |
| GET | `/api/invoices/:id` | Get single invoice |
| POST | `/api/invoices` | Create invoice |
| PATCH | `/api/invoices/:id/status` | Update status |
| DELETE | `/api/invoices/:id` | Delete invoice |
| GET | `/api/invoices/:id/pdf` | Download PDF |
| GET | `/api/stats` | Dashboard stats |
