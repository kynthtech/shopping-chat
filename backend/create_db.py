import sqlite3

# Create a new SQLite database in memory
conn = sqlite3.connect("ecommerce_test.db")
cursor = conn.cursor()

# Create tables for a simple e-commerce system
cursor.execute(
    """
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);
"""
)

cursor.execute(
    """
CREATE TABLE products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL
);
"""
)

cursor.execute(
    """
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_date TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'Processing',
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);
"""
)

cursor.execute(
    """
CREATE TABLE order_items (
    order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(order_id),
    FOREIGN KEY(product_id) REFERENCES products(product_id)
);
"""
)

cursor.execute(
    """
CREATE TABLE cart (
    cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
"""
)

cursor.execute(
    """

CREATE TABLE cart_items (
    cart_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
"""
)


# Insert some sample data
cursor.executemany(
    "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
    [
        (
            "Apple MacBook Air M2",
            "13-inch laptop with Apple M2 chip, 8GB RAM, 256GB SSD",
            1199.00,
            15,
        ),
        (
            "iPhone 14 Pro",
            "6.1-inch display, A16 Bionic chip, 128GB storage",
            999.00,
            25,
        ),
        (
            "Sony WH-1000XM5",
            "Wireless noise-cancelling over-ear headphones",
            399.00,
            40,
        ),
        (
            "Logitech MX Mechanical Keyboard",
            "Wireless mechanical keyboard with backlight",
            149.00,
            50,
        ),
        (
            "Logitech MX Master 3S Mouse",
            "Wireless ergonomic mouse with fast scrolling",
            99.00,
            70,
        ),
        (
            "Samsung 55-inch 4K TV",
            "UHD Smart TV with HDR and Alexa built-in",
            699.00,
            10,
        ),
        ("Apple iPad Air", "10.9-inch tablet with M1 chip, 64GB storage", 599.00, 30),
        (
            "Amazon Kindle Paperwhite",
            "6.8-inch display, waterproof e-reader",
            149.00,
            60,
        ),
        (
            "Bose SoundLink Flex",
            "Portable Bluetooth speaker with deep bass",
            129.00,
            80,
        ),
        ("Nintendo Switch OLED", "Hybrid console with 7-inch OLED display", 349.00, 20),
    ],
)


cursor.executemany(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [
        ("Alice Johnson", "alice@example.com"),
        ("Bob Smith", "bob@example.com"),
        ("Charlie Brown", "charlie@example.com"),
    ],
)

conn.commit()
conn.close()
