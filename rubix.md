flowchart TD
    %% ================== ENTRY ==================
    subgraph ENTRY[" "]
        direction TB
        USER[👤 User]
        MAIN[🚀 Launch]
    end

    %% ================== INPUT ==================
    subgraph INPUT[" "]
        direction TB
        IN[🎨 Input]
        VAL[✔️ Validate]
    end

    %% ================== CORE ==================
    subgraph CORE[" "]
        direction TB
        SOLVER[🧠 Solver]
        ORIENT[🔄 Orient]
    end

    %% ================== STAGES (HORIZONTAL) ==================
    subgraph STAGES[" "]
        direction LR
        CROSS[➕ Cross]
        F2L[🔗 F2L]
        OLL[🟡 OLL]
        PLL[🔁 PLL]
    end

    %% ================== OUTPUT (HORIZONTAL) ==================
    subgraph OUTPUT[" "]
        direction LR
        OPT[⚡ Optimise]
        BEST[🏆 Best]
        PRINT[📄 Result]
    end

    %% ================== FLOW ==================
    USER --> MAIN --> IN --> VAL --> SOLVER --> ORIENT
    ORIENT --> CROSS
    CROSS --> F2L --> OLL --> PLL --> OPT
    OPT --> BEST --> PRINT

    %% ================== LOOP ==================
    BEST -.-> ORIENT

    %% ================== STYLING ==================
    classDef entry fill:#1e1e2f,stroke:#3a3a55,color:#e6e6f0,rx:12,ry:12
    classDef input fill:#2a2f2a,stroke:#4a5a4a,color:#e6ffe6,rx:12,ry:12
    classDef core fill:#1b2a3a,stroke:#2f4f6f,color:#e6f0ff,rx:12,ry:12
    classDef stage fill:#1f2e2a,stroke:#3e6b5a,color:#e6fff7,rx:12,ry:12
    classDef output fill:#2a2233,stroke:#5a3e6b,color:#f3e6ff,rx:12,ry:12

    class USER,MAIN entry
    class IN,VAL input
    class SOLVER,ORIENT core
    class CROSS,F2L,OLL,PLL stage
    class OPT,BEST,PRINT output