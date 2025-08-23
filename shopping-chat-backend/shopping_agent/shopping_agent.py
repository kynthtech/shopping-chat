import json
from typing import Annotated
import uuid
from langchain_core.messages import BaseMessage, ToolMessage, AIMessage
from typing_extensions import TypedDict, Sequence

from langgraph.graph import StateGraph, START, END, MessagesState
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.graph.ui import AnyUIMessage, ui_message_reducer, push_ui_message
import os
from langchain.chat_models import init_chat_model

from shopping_agent.utils.tools import (
    get_weather,
    list_products,
    product_details,
    search_products,
    add_to_cart,
    view_cart,
)

llm = init_chat_model("openai:gpt-4.1")


class State(MessagesState):
    ui: Annotated[Sequence[AnyUIMessage], ui_message_reducer]


graph_builder = StateGraph(State)

tools = [
    get_weather,
    list_products,
    product_details,
    search_products,
    add_to_cart,
    view_cart,
]
llm_with_tools = llm.bind_tools(tools)


def chatbot(state: State):

    if (
        isinstance(state["messages"][-1], ToolMessage)
        and state["messages"][-1].name == "get_weather"
    ):
        message = AIMessage(
            id=str(uuid.uuid4()),
            content=f"Here's the weather for {state['messages'][-1].content}",
        )

        data = json.loads(str(state["messages"][-1].content))
        push_ui_message(
            "weather",
            data,
            metadata={"message_id": message.id},
            merge=True,
            message=message,
        )
    
    

    elif (
        isinstance(state["messages"][-1], ToolMessage)
        and state["messages"][-1].name == "list_products"
    ):
        message = AIMessage(
            id=str(uuid.uuid4()),
            content=f"Here's the list of products form our shop:  {state['messages'][-1].content}",
        )

        print(state['messages'][-1].content)
        data = json.loads(str(state["messages"][-1].content))
        print(data)
        push_ui_message(
            "list_products",
            props={"products": data},
            metadata={"message_id": message.id},
            merge=True,
            message=message,
        )

    elif (
        isinstance(state["messages"][-1], ToolMessage)
        and state["messages"][-1].name == "view_cart"
    ):
        message = AIMessage(
            id=str(uuid.uuid4()),
            content=f"Here's the list of products in your cart:  {state['messages'][-1].content}",
        )

        print(state['messages'][-1].content)
        data = json.loads(str(state["messages"][-1].content))
        print(data)
        push_ui_message(
            "view_cart",
            props=data,
            metadata={"message_id": message.id},
            merge=True,
            message=message,
        )

    else:
        return {"messages": [llm_with_tools.invoke(state["messages"])]}

    return {"messages": [message]}


graph_builder.add_node("chatbot", chatbot)

tool_node = ToolNode(tools=tools)
graph_builder.add_node("tools", tool_node)

graph_builder.add_conditional_edges(
    "chatbot",
    tools_condition,
)
# Any time a tool is called, we return to the chatbot to decide the next step
graph_builder.add_edge("tools", "chatbot")
graph_builder.add_edge(START, "chatbot")
agent = graph_builder.compile()
