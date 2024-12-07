import json

from openai.types.chat import (
    ChatCompletion,
    ChatCompletionToolParam,
)


def build_search_function() -> list[ChatCompletionToolParam]:
    return [
        {
            "type": "function",
            "function": {
                "name": "search_database",
                "description": "Search PostgreSQL database for relevant texto based on user query",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "search_query": {
                            "type": "string",
                            "description": "Query string to use for full text search, e.g. 'durante as ferias'",
                        },
                        "categoria_filter": {
                            "type": "object",
                            "description": "Filter search results based on categoria",
                            "properties": {
                                "comparison_operator": {
                                    "type": "string",
                                    "description": "Operator to compare the column value, either '=' or '!='",
                                },
                                "value": {
                                    "type": "string",
                                    "description": "Value to compare against, e.g. Art. 143",
                                },
                            },
                        },
                    },
                    "required": ["search_query"],
                },
            },
        }
    ]


def extract_search_arguments(original_user_query: str, chat_completion: ChatCompletion):
    response_message = chat_completion.choices[0].message
    search_query = None
    filters = []
    if response_message.tool_calls:
        for tool in response_message.tool_calls:
            if tool.type != "function":
                continue
            function = tool.function
            if function.name == "search_database":
                arg = json.loads(function.arguments)

                search_query = arg.get("search_query", original_user_query)

                if "categoria_filter" in arg and arg["categoria_filter"]:
                    categoria_filter = arg["categoria_filter"]
                    filters.append(
                        {
                            "column": "categoria",
                            "comparison_operator": categoria_filter["comparison_operator"],
                            "value": categoria_filter["value"],
                        }
                    )
    elif query_text := response_message.content:
        search_query = query_text.strip()
    return search_query, filters
