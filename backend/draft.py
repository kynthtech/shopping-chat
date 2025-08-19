import sqlite3
from typing import List, Dict, Union, Annotated, Sequence
import uuid

from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langgraph.graph.ui import AnyUIMessage, ui_message_reducer, push_ui_message, delete_ui_message
from langchain_core.messages import AIMessage, BaseMessage
from langgraph.graph.message import add_messages, MessagesState
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.prebuilt.chat_agent_executor import AgentState
from langgraph.graph import START, StateGraph
from langgraph.prebuilt import tools_condition, ToolNode
from IPython.display import Image, display

from tools import (
    list_products,
    product_details,
    search_products,
    add_to_cart,
    view_cart,
    checkout,
    get_order_status,
    get_weather,
)

# 3. Build the agent
llm = ChatOpenAI(model="gpt-4o-mini")
tools = [
    list_products,
    product_details,
    search_products,
    add_to_cart,
    view_cart,
    checkout,
    get_order_status,
    get_weather,
]

llm_with_tools = llm.bind_tools(tools)

shopping_prompt = """
You are a helpful shopping assistant. 
You can both answer general questions and interact with the e-commerce database and cart when needed.

Behavior Rules:
1. If the user asks a general or conversational question (e.g., greetings, small talk), respond directly without using any tools.
2. If the user asks about shopping, browsing products, checking details, adding to cart, viewing the cart, or checking out, use the provided tools.
3. Always try to keep responses short, clear, and helpful.
4. use weather tool only when the user explicitly asks for weather information.
5. If the tool result contains _ui: True, don’t re-state it to the user. Just return empty str because we are rendering the same info in the ui as special component.

Shopping Interaction Rules:
- When browsing products, show only relevant fields: product id, name, price, and stock.
- When showing details for a single product, include id, name, price, and stock.
- When showing cart, include product name, quantity, price, and total.
- At checkout, confirm the order summary clearly.

Output Format:
- Always give a short natural language summary (1–2 sentences).
- If the answer contains structured data (like product lists, cart contents, or orders), present it as a **Markdown table** with only the most relevant columns.
- Do NOT show raw JSON or SQL queries.
- Do NOT expose internal tool calls.

Examples:

User: "Hi, how are you?"
Assistant: "I’m doing great! Excited to help you shop today."

User: "Show me the products"
Assistant: 
Here are the products available right now:

| ID | Product    | Price | Stock |
|----|------------|-------|-------|
| 1  | Laptop     | 750   | 10    |
| 2  | Smartphone | 500   | 25    |

User: "Add 2 headphones to my cart"
Assistant:
🛒 Added 2 Headphones to your cart.

User: "View my cart"
Assistant:
Here’s what’s in your cart:

| Product    | Quantity | Price | Subtotal |
|------------|----------|-------|----------|
| Headphones | 2        | 50    | 100      |

Total: **$100**

User: "Checkout"
Assistant:
✅ Your order has been placed! Thank you for shopping with us.
"""


class CustomAgentState(AgentState):
    ui: Annotated[Sequence[AnyUIMessage], ui_message_reducer]


def assistant(state: MessagesState):
   return {"messages": [llm_with_tools.invoke([shopping_prompt] + state["messages"])]}


# Graph
builder = StateGraph(MessagesState)

# Define nodes: these do the work
builder.add_node("assistant", assistant)
builder.add_node("tools", ToolNode(tools))

# Define edges: these determine how the control flow moves
builder.add_edge(START, "assistant")
builder.add_conditional_edges(
    "assistant",
    # If the latest message (result) from assistant is a tool call -> tools_condition routes to tools
    # If the latest message (result) from assistant is a not a tool call -> tools_condition routes to END
    tools_condition,
)
builder.add_edge("tools", "assistant")
agent = builder.compile()
