# 1. Connect to SQLite DB
import sqlite3
from typing import List, Dict, Union, Annotated, Sequence
import uuid
from langchain_core.tools import tool
from langgraph.graph.ui import AnyUIMessage, ui_message_reducer, push_ui_message, delete_ui_message
from langchain_core.messages import AIMessage, BaseMessage


def get_db_connection():
    """Returns a new database connection and cursor."""
    conn = sqlite3.connect("ecommerce_test.db")
    return conn, conn.cursor()


# 2. Define tools for the agent
@tool
def get_weather(location: str) -> str:
    """Get the current weather for a location."""
    # Simulate weather API call
    weather_data = {
        "city": location,
        "temperature": "72°F",
        "condition": "Sunny",
        "humidity": "45%",
        "wind": "5 mph",
    }

    message = AIMessage(
        id=str(uuid.uuid4()),
        content=f"Weather in {location}: {weather_data['temperature']}, {weather_data['condition']}",
    )

    push_ui_message(
        "weather",
        props=weather_data,
        message=message ,
        merge=True,
    )
    return f"Weather in {location}: {weather_data['temperature']}, {weather_data['condition']},  '_ui'=True"


@tool
def list_products() -> List[Dict[str, Union[int, str, float]]]:
    """Lists all available products with id, name, price, and stock."""
    # Create a new connection and cursor within the tool's execution context
    conn, cursor = get_db_connection()

    try:
        cursor.execute("SELECT product_id, name, price, stock FROM products;")
        products = cursor.fetchall()

        columns = [desc[0] for desc in cursor.description]
        product_list = [dict(zip(columns, row)) for row in products]

        return product_list
    finally:
        # Always close the connection
        conn.close()


@tool
def product_details(product_id: int) -> Union[Dict[str, Union[int, str, float]], str]:
    """Gets details of a specific product by its ID."""
    conn, cursor = get_db_connection()

    try:
        cursor.execute(
            "SELECT product_id, name, price, stock FROM products WHERE product_id=?;",
            (product_id,),
        )
        product = cursor.fetchone()

        if not product:
            return "❌ Product not found."

        columns = [desc[0] for desc in cursor.description]
        product_dict = dict(zip(columns, product))

        return product_dict
    finally:
        conn.close()


@tool
def search_products(query: str) -> List[Dict[str, Union[int, str, float]]]:
    """Searches for products by name using a keyword."""
    conn, cursor = get_db_connection()

    try:
        cursor.execute(
            "SELECT product_id, name, price, stock FROM products WHERE name LIKE ?;",
            ("%" + query + "%",),
        )
        products = cursor.fetchall()

        if not products:
            return []

        columns = [desc[0] for desc in cursor.description]
        product_list = [dict(zip(columns, row)) for row in products]

        return product_list
    finally:
        conn.close()


@tool
def add_to_cart(user_id: int, product_id: int, quantity: int) -> str:
    """Adds a product to the user's cart."""
    conn, cursor = get_db_connection()

    try:
        # Get product details
        cursor.execute(
            "SELECT product_id, name, stock FROM products WHERE product_id=?;",
            (product_id,),
        )
        product = cursor.fetchone()

        if not product:
            return "❌ Product not found."

        product_stock = product[2]
        product_name = product[1]

        if product_stock < quantity:
            return f"❌ Only {product_stock} units of {product_name} available."

        # Get or create cart
        cursor.execute("SELECT cart_id FROM cart WHERE user_id=?;", (user_id,))
        cart = cursor.fetchone()

        if not cart:
            print("Creating new cart for user.")
            cursor.execute("INSERT INTO cart (user_id) VALUES (?);", (user_id,))
            cart_id = cursor.lastrowid
        else:
            print("Using existing cart for user.")
            cart_id = cart[0]

        # Check if item already exists in cart
        cursor.execute(
            "SELECT cart_item_id, quantity FROM cart_items WHERE cart_id=? AND product_id=?;",
            (cart_id, product_id),
        )
        existing_item = cursor.fetchone()

        if existing_item:
            new_qty = existing_item[1] + quantity
            cursor.execute(
                "UPDATE cart_items SET quantity=? WHERE cart_item_id=?;",
                (new_qty, existing_item[0]),
            )
        else:
            cursor.execute(
                "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?);",
                (cart_id, product_id, quantity),
            )

        conn.commit()
        return f"🛒 Added {quantity} x {product_name} to cart."

    except sqlite3.Error as e:
        conn.rollback()
        return f"❌ An error occurred: {e}"
    finally:
        conn.close()


@tool
def view_cart(user_id: int) -> Union[Dict, str]:
    """Views items in the user's cart with totals."""
    conn, cursor = get_db_connection()

    try:
        cursor.execute("SELECT cart_id FROM cart WHERE user_id=?;", (user_id,))
        cart = cursor.fetchone()

        if not cart:
            return "🛒 Cart is empty."

        cart_id = cart[0]

        cursor.execute(
            """
            SELECT p.name, ci.quantity, p.price, (ci.quantity * p.price) AS subtotal
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id=?;
            """,
            (cart_id,),
        )
        items = cursor.fetchall()

        if not items:
            return "🛒 Cart is empty."

        # Convert tuples to dictionaries for better output
        columns = [desc[0] for desc in cursor.description]
        cart_items_list = [dict(zip(columns, row)) for row in items]

        total = sum(i["subtotal"] for i in cart_items_list)

        return {"items": cart_items_list, "total": total}

    except sqlite3.Error as e:
        return f"❌ An error occurred: {e}"
    finally:
        conn.close()


@tool
def checkout(user_id: int) -> str:
    """Checks out the cart: creates an order and clears cart."""
    conn, cursor = get_db_connection()

    try:
        # Begin transaction
        conn.execute("BEGIN;")

        # Check for cart and items
        cursor.execute("SELECT cart_id FROM cart WHERE user_id=?;", (user_id,))
        cart = cursor.fetchone()

        if not cart:
            return "❌ No cart found."

        cart_id = cart[0]

        cursor.execute(
            """
            SELECT ci.product_id, p.name, ci.quantity, p.price, p.stock
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id=?;
            """,
            (cart_id,),
        )
        items = cursor.fetchall()

        if not items:
            return "❌ Cart is empty."

        # Convert to a list of dicts and check stock
        columns = [desc[0] for desc in cursor.description]
        cart_items_list = [dict(zip(columns, row)) for row in items]

        for item in cart_items_list:
            if item["stock"] < item["quantity"]:
                return f"❌ Not enough stock for {item['name']}."

        total = sum(item["price"] * item["quantity"] for item in cart_items_list)

        # Create order
        cursor.execute(
            "INSERT INTO orders (user_id, order_date, total, status) VALUES (?, date('now'), ?, 'Processing');",
            (user_id, total),
        )
        order_id = cursor.lastrowid

        # Insert items into order_items and reduce product stock
        for item in cart_items_list:
            cursor.execute(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?);",
                (order_id, item["product_id"], item["quantity"], item["price"]),
            )
            cursor.execute(
                "UPDATE products SET stock = stock - ? WHERE product_id=?;",
                (item["quantity"], item["product_id"]),
            )

        # Clear cart items
        cursor.execute("DELETE FROM cart_items WHERE cart_id=?;", (cart_id,))

        conn.commit()
        return f"✅ Order {order_id} placed successfully! Total: ${total:.2f}"

    except sqlite3.Error as e:
        conn.rollback()  # Rollback on error
        return f"❌ An error occurred: {e}"
    finally:
        conn.close()


@tool
def get_order_status(order_id: int) -> Union[Dict, str]:
    """Gets the status and details of a specific order."""
    conn, cursor = get_db_connection()

    try:
        cursor.execute(
            "SELECT order_id, order_date, total, status FROM orders WHERE order_id=?;",
            (order_id,),
        )
        order = cursor.fetchone()

        if not order:
            return "❌ Order not found."

        order_columns = [desc[0] for desc in cursor.description]
        order_dict = dict(zip(order_columns, order))

        cursor.execute(
            """
            SELECT p.name, oi.quantity, oi.price, (oi.quantity * oi.price) AS subtotal
            FROM order_items oi
            JOIN products p ON oi.product_id = p.product_id
            WHERE oi.order_id=?;
            """,
            (order_id,),
        )
        items = cursor.fetchall()

        item_columns = [desc[0] for desc in cursor.description]
        items_list = [dict(zip(item_columns, row)) for row in items]

        return {"order": order_dict, "items": items_list}

    except sqlite3.Error as e:
        return f"❌ An error occurred: {e}"
    finally:
        conn.close()
