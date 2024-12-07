import { useState } from "react";
import { Stack, IDropdownOption, Dropdown } from "@fluentui/react";

import styles from "./VectorSettings.module.css";
import { RetrievalMode } from "../../api";

interface Props {
    updateRetrievalMode: (retrievalMode: RetrievalMode) => void;
}

export const VectorSettings = ({ updateRetrievalMode }: Props) => {
    const [retrievalMode, setRetrievalMode] = useState<RetrievalMode>(RetrievalMode.Hybrid);

    const onRetrievalModeChange = (_ev: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<RetrievalMode> | undefined) => {
        setRetrievalMode(option?.data || RetrievalMode.Hybrid);
        updateRetrievalMode(option?.data || RetrievalMode.Hybrid);
    };


    return (
        <Stack className={styles.container} tokens={{ childrenGap: 10 }}>
            <Dropdown
                label="Modo de Resposta"
                options={[
                    { key: "hybrid", text: "Vetorial + Texto LLM", selected: retrievalMode == RetrievalMode.Hybrid, data: RetrievalMode.Hybrid },
                    { key: "vectors", text: "vetorial", selected: retrievalMode == RetrievalMode.Vectors, data: RetrievalMode.Vectors },
                    { key: "text", text: "Texto LLM", selected: retrievalMode == RetrievalMode.Text, data: RetrievalMode.Text }
                ]}
                required
                onChange={onRetrievalModeChange}
            />

        </Stack>
    );
};
