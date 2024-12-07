import { AIChatCompletion, AIChatCompletionDelta, AIChatCompletionOperationOptions } from "@microsoft/ai-chat-protocol";

export const enum RetrievalMode {
    Hybrid = "hibrido",
    Vectors = "vetor",
    Text = "texto"
}

export type ChatAppRequestOverrides = {
    use_advanced_flow?: boolean;
    retrieval_mode?: RetrievalMode;
    top?: number;
    temperature?: number;
    prompt_template?: string;
};

export type ChatAppRequestContext = {
    overrides: ChatAppRequestOverrides;
};

export interface ChatAppRequestOptions extends AIChatCompletionOperationOptions {
    context: ChatAppRequestContext
}

export type Thoughts = {
    title: string;
    description: any; 
    props?: { [key: string]: string };
};

export type RAGContext = {
    data_points: { [key: string]: any };
    followup_questions: string[] | null;
    thoughts: Thoughts[];
};

export interface RAGChatCompletion extends AIChatCompletion {
    context: RAGContext;
}

export interface RAGChatCompletionDelta extends AIChatCompletionDelta {
    context: RAGContext;
}
