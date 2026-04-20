import sqlite3
import os

# ─── Connect (creates DB if not exists) ───────────────────────────────────────
DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")
conn = sqlite3.connect(DB_PATH)

# ─── Ensure table exists ──────────────────────────────────────────────────────
conn.execute("""
    CREATE TABLE IF NOT EXISTS invoices (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        customer    TEXT    NOT NULL,
        product     TEXT    NOT NULL,
        price       REAL    NOT NULL,
        qty         INTEGER NOT NULL,
        subtotal    REAL    NOT NULL,
        tax_rate    REAL    NOT NULL DEFAULT 0,
        tax_amt     REAL    NOT NULL DEFAULT 0,
        grand_total REAL    NOT NULL,
        status      TEXT    NOT NULL DEFAULT 'unpaid',
        created_at  TEXT    NOT NULL
    )
""")

# ─── Optional reset (uncomment to wipe existing data before seeding) ──────────
# conn.execute("DELETE FROM invoices")

# ─── Seed data ────────────────────────────────────────────────────────────────
entries = [
    ("Aarav Sharma",      "Laptop Charger",      1500,  2, 3000,  18,  540,   3540,  "paid",    "2024-01-05T10:00:00"),
    ("Isha Verma",        "Smartphone",          20000, 1, 20000, 18,  3600,  23600, "paid",    "2024-01-10T12:30:00"),
    ("Rohan Gupta",       "Bluetooth Earbuds",   2500,  2, 5000,  18,  900,   5900,  "unpaid",  "2024-01-15T09:15:00"),
    ("Sneha Kapoor",      "Tablet",              18000, 1, 18000, 18,  3240,  21240, "paid",    "2024-02-01T11:00:00"),
    ("Aditya Singh",      "Power Bank",          1200,  3, 3600,  18,  648,   4248,  "overdue", "2024-02-05T14:00:00"),
    ("Priya Nair",        "USB Cable",           300,   5, 1500,  12,  180,   1680,  "paid",    "2024-02-10T16:45:00"),
    ("Kunal Mehta",       "Laptop Stand",        2000,  2, 4000,  18,  720,   4720,  "unpaid",  "2024-02-20T10:20:00"),
    ("Neha Joshi",        "Wireless Mouse",      800,   3, 2400,  18,  432,   2832,  "paid",    "2024-03-01T09:30:00"),
    ("Rahul Yadav",       "Mechanical Keyboard", 3500,  1, 3500,  18,  630,   4130,  "paid",    "2024-03-05T13:10:00"),
    ("Ananya Iyer",       "Monitor",             12000, 1, 12000, 18,  2160,  14160, "overdue", "2024-03-12T15:00:00"),
    ("Vikram Desai",      "External Hard Drive", 6000,  1, 6000,  18,  1080,  7080,  "paid",    "2024-03-20T11:45:00"),
    ("Pooja Chatterjee",  "Smartwatch",          5000,  2, 10000, 12,  1200,  11200, "paid",    "2024-04-02T10:10:00"),
    ("Arjun Reddy",       "Gaming Headset",      3000,  2, 6000,  18,  1080,  7080,  "unpaid",  "2024-04-08T12:00:00"),
    ("Meera Pillai",      "Webcam",              2500,  1, 2500,  18,  450,   2950,  "paid",    "2024-04-15T14:25:00"),
    ("Siddharth Jain",    "Router",              3500,  1, 3500,  18,  630,   4130,  "overdue", "2024-04-22T09:50:00"),
    ("Kavya Menon",       "Speaker",             4000,  2, 8000,  12,  960,   8960,  "paid",    "2024-05-01T16:00:00"),
    ("Manish Agarwal",    "SSD",                 7000,  1, 7000,  12,  840,   7840,  "paid",    "2024-05-05T11:35:00"),
    ("Ritika Bansal",     "Printer",             9000,  1, 9000,  18,  1620,  10620, "unpaid",  "2024-05-10T13:20:00"),
    ("Deepak Mishra",     "Graphics Card",       25000, 1, 25000, 18,  4500,  29500, "paid",    "2024-05-18T10:05:00"),
    ("Nikhil Saxena",     "Laptop Bag",          1500,  2, 3000,  18,  540,   3540,  "paid",    "2024-05-25T15:40:00"),
]

conn.executemany("""
    INSERT INTO invoices
        (customer, product, price, qty, subtotal, tax_rate, tax_amt, grand_total, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", entries)

conn.commit()
conn.close()

print(f"✅ Done — inserted {len(entries)} invoices into {DB_PATH}")
