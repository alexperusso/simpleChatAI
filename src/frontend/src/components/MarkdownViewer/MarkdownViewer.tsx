import React, { useState, useEffect } from "react";
import { marked } from "marked";
import styles from "./MarkdownViewer.module.css";
import { Spinner, SpinnerSize, MessageBar, MessageBarType, Link, IconButton } from "@fluentui/react";

interface MarkdownViewerProps {
    src: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ src }) => {
    const [content, setContent] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Remove links do HTML resultante para evitar erros 404.
     */
    const removeAnchorLinks = (html: string) => {
        const ancorLinksRegex = /<a\s+(?:[^>]*?\s+)?href=['"](#[^"']*?)['"][^>]*?>/g;
        return html.replace(ancorLinksRegex, "");
    };

    useEffect(() => {
        const fetchMarkdown = async () => {
            try {
                const response = await fetch(src);

                if (!response.ok) {
                    throw new Error("Falha no Carregamento do arquivo markdown.");
                }

                const markdownText = await response.text();
                const parsedHtml = await marked.parse(markdownText);
                const cleanedHtml = removeAnchorLinks(parsedHtml);
                setContent(cleanedHtml);
            } catch (error: any) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMarkdown();
    }, [src]);

    return (
        <div>
            {isLoading ? (
                <div className={`${styles.loading} ${styles.markdownViewer}`}>
                    <Spinner size={SpinnerSize.large} label="Carregando Arquivo" />
                </div>
            ) : error ? (
                <div className={`${styles.error} ${styles.markdownViewer}`}>
                    <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
                        {error.message}
                        <Link href={src} download>
                            Download de arquivo
                        </Link>
                    </MessageBar>
                </div>
            ) : (
                <div>
                    <IconButton
                        className={styles.downloadButton}
                        style={{ color: "black" }}
                        iconProps={{ iconName: "Save" }}
                        title="Salvar"
                        ariaLabel="Salvar"
                        href={src}
                        download
                    />
                    <div className={`${styles.markdown} ${styles.markdownViewer}`} dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            )}
        </div>
    );
};
