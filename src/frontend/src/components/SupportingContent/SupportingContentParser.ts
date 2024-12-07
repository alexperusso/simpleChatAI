import DOMPurify from "dompurify";

type ParsedSupportingContentItem = {
    title: string;
    content: string;
};

export function parseSupportingContentItem(item: string): ParsedSupportingContentItem {
    // Nome de arquivo: Conteudo - ex "documento.pdf: conteudo do arquivo".
    const parts = item.split(": ");
    const title = parts[0];
    const content = DOMPurify.sanitize(parts.slice(1).join(": "));

    return {
        title,
        content
    };
}
