export interface Project {
  id: string
  name: string
  description: string
  longDescription: string
  category: ("Professional" | "Personal" | "Open Source")[]
  tech: string[]
  date: string
  link?: string
  github?: string
}

export interface Experience {
  id: string
  role: string
  company: string
  description: string
  duration: string
  highlights: string[]
  skills: string[]
}

export const projects: Project[] = [
  {
    id: "watchdog",
    name: "Watchdog",
    description: "Server access management tool tracking administrative rights",
    longDescription:
      "- Written in Rust, a personalized server access management tool that tracks all administrative rights attempts (like sudo and su) on the server via SSH\n- Allows/denies access based on user public keys and logs all activity in Slack messages\n- Provides easy granting/revoking access to 4 servers for 50+ SDSLabs team members through pull requests",
    category: ["Open Source"],
    tech: ["Rust", "SSH", "Linux", "Slack API"],
    date: "Dec 2024 - Present",
    github: "https://github.com/sdslabs/watchdog",
  },
  {
    id: "pgmoneta",
    name: "pgmoneta",
    description: "High-performance PostgreSQL connection pooler",
    longDescription:
      "- A lightweight, high-performance connection pooler for PostgreSQL designed for low-latency environments and efficient resource usage\n- Added Docker support for containerized workflows\n- Integrated FreeBSD support into the CI pipeline to expand to 3 platforms\n- Implemented load-save approach for struct backup flow, reducing 7+ functions to 2",
    category: ["Open Source"],
    tech: ["C", "PostgreSQL", "Docker", "CI/CD"],
    date: "Mar 2025 - Jul 2025",
    github: "https://github.com/pgmoneta/pgmoneta",
  },
  {
    id: "meridb",
    name: "MeriDB",
    description: "SQL database built from scratch in Rust",
    longDescription:
      "- SQL database built from scratch in Rust with a custom lexer, parser, storage engine, and terminal-style query interface\n- Implemented paged storage (pages/records) and modular architecture across parsing, execution, input handling, and storage\n- Roadmap includes B-Tree indexing, server mode, Dockerization, and extended SQL support",
    category: ["Personal"],
    tech: ["Rust", "SQL", "Database Engine"],
    date: "2025 - Present",
    github: "https://github.com/Arshdeep54/meridb",
  },
  {
    id: "inomy",
    name: "Inomy",
    description: "AI-powered shopping assistant on Intent Protocol",
    longDescription:
      "- Built Inomy, an AI-powered shopping assistant around the Intent Protocol\n- Contributed to Next.js frontend, smart contracts on Base chain, and ERC-20 token implementation\n- Worked on the complete DApp lifecycle from smart contract integration to frontend and backend deployment",
    category: ["Professional"],
    tech: ["Solidity", "Next.js", "Web3", "Base Chain", "React"],
    date: "Dec 2024 - Jan 2025",
  },
  {
    id: "labos-event-harvester",
    name: "Event Harvester",
    description: "Event aggregator for Luma and Cryptonomad",
    longDescription:
      "- Built as part of Protocol Labs Dev Guild Cohort 3\n- Event aggregator for Luma and Cryptonomad with comprehensive data cleaning and Airtable integration\n- Processes and normalizes event data from multiple sources into a unified format",
    category: ["Professional", "Open Source"],
    tech: ["TypeScript", "Airtable API", "Data Processing"],
    date: "Apr 2025 - Oct 2025",
  },
  {
    id: "ask-racha",
    name: "Ask Racha",
    description: "Docs Q&A with vector database retrieval",
    longDescription:
      "- Built as part of Protocol Labs Dev Guild Cohort 4\n- Docs Q&A system that parses documentation and repositories, embedding them into Qdrant (vector DB) for low-latency retrieval\n- Built a lightweight retrieval API that enables semantic search across documentation using vector embeddings",
    category: ["Professional", "Open Source"],
    tech: ["Vector DB", "Qdrant", "LlamaIndex", "Python", "Discord Bot",],
    date: "Apr 2025 - Oct 2025",
  },
  {
    id: "wasmedge-installer",
    name: "Wasmedgeup",
    description: "Cross-platform WasmEdge installer with hardware detection",
    longDescription:
      "- Implemented core features for cross-platform WasmEdge installer including remove, versioning, and plugin management\n- Added hardware/system detection for optimal runtime configuration (CPU features, GPU backends: CUDA/ROCm/OpenCL) with validation and tests\n- Strengthened reliability with checksum verification, documentation, and CI across Linux, macOS, and Windows",
    category: ["Professional", "Open Source"],
    tech: ["Rust", "Cross-platform", "CI/CD", "Hardware Detection"],
    date: "Sep 2025 - Nov 2025",
    github: "https://github.com/Arshdeep54",
  },
  {
    id: "zynk",
    name: "zynk",
    description: "[WIP] - LSM based kv store powered by CRDTs",
    longDescription:
      "- Built a distributed key–value store prototype in Rust with embedded LSM-based storage engine (memtable + SSTables) for write-optimized persistence\n- Implemented eventually consistent replication using state-based CRDTs (Grow-only Set, Replicated Growable Array) with deterministic merge operations\n- Designed Kubernetes-native architecture with gRPC communication, leader election via Kubernetes Lease, and a load balancer (zynk-lb) for scalable deployment",
    category: ["Personal"],
    tech: ["Rust", "gRPC", "Kubernetes", "CRDTs", "LSM"],
    date: "Nov 2025",
    github: "https://github.com/Arshdeep54/zynk",
  },
  {
    id: "indexium",
    name: "indexium",
    description: "Implementation of all the major indexing data structures commonly used in database internals.",
    longDescription:
      "- Implemented B-tree index with snapshot functionality for consistent read views\n- Built core B-tree operations including insert, search, and node management\n- Currently working on HNSW (Hierarchical Navigable Small World) index for vector similarity search",
    category: ["Personal"],
    tech: ["Rust"],
    date: "Sep 2025",
    github: "https://github.com/Arshdeep54/indexium",
  },
  {
    id: "greptimedb",
    name: "greptimedb",
    description: "Open-source, cloud-native, unified observability database for metrics, logs and traces, supporting S...",
    longDescription: "- Open-source, cloud-native, unified observability database for metrics, logs and traces, supporting SQL/PromQL/Streaming. Available on GreptimeCloud\n- Improved data import reliability by adding path existence checks with clear error handling\n- Enhanced data type handling by enabling Map to JSON binary conversion in COPY Table command",
    category: ["Open Source"],
    tech: ["Rust"],
    date: "Aug 2025",
    github: "https://github.com/GreptimeTeam/greptimedb/",
  },
  {
    id: "input-handler",
    name: "input_handler",
    description: "Maintains history in your rust cli apps, allows terminal-style editing.",
    longDescription:
      "- Rust library for maintaining command history in CLI applications\n- Provides terminal-style editing capabilities with readline-like functionality\n- Enables persistent history storage and retrieval for improved user experience",
    category: ["Personal"],
    tech: ["Rust"],
    date: "Aug 2025",
    github: "https://github.com/Arshdeep54/input_handler",
  },
  
  {
    id: "pgagroal",
    name: "pgagroal",
    description: "High-performance connection pool for PostgreSQL",
    longDescription:
      "- Added Docker support to pgagroal for containerized deployments\n- Integrated FreeBSD support into the CI pipeline to expand platform coverage\n- Made systemd optional to improve flexibility for different deployment environments\n- Updated documentation links and improved project maintainability",
    category: ["Open Source"],
    tech: ["C", "Docker", "CI/CD"],
    date: "May 2025",
    github: "https://github.com/agroal/pgagroal",
  },
  {
    id: "lid-driven-cavity",
    name: "lid-driven-cavity",
    description: "Lid-Driven Cavity Flow Simulation",
    longDescription:
      "- Implemented numerical simulation of lid-driven cavity flow using Navier-Stokes equations in vorticity-streamfunction formulation\n- Built solver using finite-difference methods with Jacobi iteration for Poisson equation and vorticity transport equation\n- Created animated visualization with streamfunction contours and velocity vectors using matplotlib, with configurable Reynolds numbers and grid resolution",
    category: ["Personal"],
    tech: ["Python", "NumPy", "Matplotlib", "Fluid Dynamics", "Numerical Methods"],
    date: "May 2025",
    github: "https://github.com/Arshdeep54/lid-driven-cavity",
  },
  {
    id: "pgexporter",
    name: "pgexporter",
    description: "Prometheus exporter for PostgreSQL",
    longDescription:
      "- Contributed to pgexporter, a Prometheus exporter for PostgreSQL monitoring\n- Worked on improvements to metric collection and export functionality\n- Enhanced compatibility and reliability of PostgreSQL metrics exposure",
    category: ["Open Source"],
    tech: ["C", "PostgreSQL", "Prometheus"],
    date: "Apr 2025",
    github: "https://github.com/pgexporter/pgexporter",
  },
  {
    id: "pgexporter-ext",
    name: "pgexporter_ext",
    description: "PostgreSQL extension for pgexporter",
    longDescription:
      "- Contributed to pgexporter_ext, a PostgreSQL extension that provides additional Prometheus metrics for system monitoring\n- Worked on extending metrics collection for OS information, CPU, memory, network, load average, and disk space\n- Enhanced the extension's functionality to expose comprehensive system metrics through PostgreSQL for Prometheus monitoring",
    category: ["Open Source"],
    tech: ["C", "PostgreSQL", "Prometheus", "CMake"],
    date: "Apr 2025",
    github: "https://github.com/pgexporter/pgexporter_ext",
  },
  {
    id: "sniff",
    name: "sniff",
    description: "A fast and minimal CLI tool for searching text in files",
    longDescription: "- Sniff is a high-performance, multithreaded text search utility that supports various search algorithms, including Boyer-Moore, Knuth-Morris-Pratt (KMP), and Rabin-Karp. It efficiently searches for patterns in large text files and provides options for threaded execution to enhance performance.",
    category: ["Personal"],
    tech: ["C", "Cli"],
    date: "Apr 2025",
    github: "https://github.com/Arshdeep54/sniff",
  },
  {
    id: "cinequestwa",
    name: "Cinequest",
    description: "This project is a combination of a React frontend and a Django backend. This is a movies website whe...",
    longDescription: "This project is a combination of a React frontend and a Django backend. This is a movies website where a user or movie critic can create an account and can see or post his own reviews for a movie .",
    category: ["Personal"],
    tech: ["JavaScript", "Django", "Djanogo-rest-framework", "Mysql", "React", "Scraping"],
    date: "Jun 2025",
    github: "https://github.com/Arshdeep54/CinequestWA",
  },
  
  {
    id: "aura-land",
    name: "Aura-Land",
    description: "Cross-Chain NFT Gaming Platform",
    longDescription:
      "- Cross-chain NFT gaming platform where players can select characters, mint NFTs, and interact with NPCs for trading and battles\n- Built multiplayer features with real-time trading, chat, and battles using Socket.io for WebSocket communication\n- Implemented in-game economy with ERC-20 tokens, NFT marketplace, and Soulbound Tokens (SBTs) for achievements using Solidity and Foundry\n- Developed game client with Next.js, Phaser.js, and Three.js, with Privy authentication and IPFS storage for decentralized NFT metadata",
    category: ["Personal"],
    tech: ["TypeScript", "Next.js", "Solidity", "Foundry", "Phaser.js", "Socket.io", "IPFS", "Web3"],
    date: "May 2025",
    github: "https://github.com/arnavkirti/Aura-Land",
  },
  {
    id: "pokegame",
    name: "PokeGame",
    description: "Pokemon game made with javascipt and canvas",
    longDescription: "Pokemon game made with javascipt and canvas",
    category: ["Personal"],
    tech: ["JavaScript", "Canvas", "Canvas2d", "Class-based-components", "Css"],
    date: "Aug 2024",
    github: "https://github.com/Arshdeep54/PokeGame",
  },
  {
    id: "expense-manager",
    name: "Expense-manager",
    description: "Expense Manager is a hybrid app to manage and store user's transactions , made with React Native and...",
    longDescription: "Expense Manager is a hybrid app to manage and store user's transactions , made with React Native and firebase ",
    category: ["Personal"],
    tech: ["JavaScript", "Expo-cli", "React-native"],
    date: "Aug 2024",
    github: "https://github.com/Arshdeep54/Expense-manager",
  },
  {
    id: "shelflove-mvc",
    name: "Shelflove-mvc",
    description: "Full Stack Library Management system ",
    longDescription: "Full Stack Library Management system following MVC (Model-View-Controller) architecture, fully dockerised, hosted locally on apache",
    category: ["Personal"],
    tech: ["Go", "Apache2", "Docker", "Docker-compose", "Golang", "Mysql"],
    date: "Aug 2024",
    github: "https://github.com/Arshdeep54/Shelflove-mvc",
  },
  {
    id: "bettleground",
    name: "BettleGround",
    description: "BettleGround repository",
    longDescription: "BettleGround repository",
    category: ["Personal"],
    tech: ["React", "Smart Contracts", "Solidity"],
    date: "Jul 2024",
    github: "https://github.com/Arshdeep54/BettleGround",
  },
  {
    id: "pestcontrol",
    name: "PestControl",
    description: "3D game with AI enemy made with Unity ,C#",
    longDescription: "3D game with AI enemy made with Unity ,C#",
    category: ["Personal"],
    tech: ["Unity", "Game Development", "C#"],
    date: "Jul 2024",
    github: "https://github.com/Arshdeep54/PestControl",
  },
  {
    id: "shelflove",
    name: "Shelflove",
    description: "Shelflove repository",
    longDescription: "Shelflove repository",
    category: ["Personal"],
    tech: ["CSS"],
    date: "Jun 2024",
    github: "https://github.com/Arshdeep54/Shelflove",
  },
  {
    id: "sudukojava",
    name: "SudukoJava",
    description: "sudoku solver using java swing ",
    longDescription: "sudoku solver using java swing ",
    category: ["Personal"],
    tech: ["Java", "Javaswing"],
    date: "May 2025",
    github: "https://github.com/Arshdeep54/SudukoJava",
  },
]

export const experiences: Experience[] = [
  {
    id: "pldg",
    role: "Contributor",
    company: "Protocol Labs Dev Guild",
    description: "Contributing to open-source projects in LabOS",
    duration: "Apr 2025 - Oct 2025",
    highlights: [
      "Built Event Harvester — event aggregator for Luma and Cryptonomad with data cleaning and Airtable integration",
      "Built Ask Racha — docs Q&A; parsed docs and repos, embedded into Qdrant (vector DB) for low-latency retrieval",
    ],
    skills: ["Open Source", "Data Processing", "Vector Databases", "API Development"],
  },
  {
    id: "lfx-wasmedge",
    role: "LFX Mentee",
    company: "WasmEdge",
    description: "Implementing core features for cross-platform installer",
    duration: "Sep 2025 - Nov 2025",
    highlights: [
      "Implemented remove, versioning, and plugin management",
      "Added hardware/system detection for optimal runtime configuration",
      "Strengthened reliability with checksum verification and CI/CD",
    ],
    skills: ["Rust", "Cross-platform Development", "CI/CD", "System Programming"],
  },
  {
    id: "inomy-dev",
    role: "Full Stack Blockchain Developer",
    company: "Inomy",
    description: "Built AI-powered shopping assistant on Intent Protocol",
    duration: "Dec 2024 - Jan 2025",
    highlights: [
      "Contributed to Next.js frontend architecture",
      "Implemented smart contracts on Base chain",
      "Worked on complete DApp lifecycle from integration to deployment",
    ],
    skills: ["Solidity", "Next.js", "Web3", "Smart Contracts", "React"],
  },
  {
    id: "sds-labs-dev",
    role: "Developer",
    company: "SDSLabs",
    description: "Maintaining and developing applications for campus and internet",
    duration: "Feb 2024 - Present",
    highlights: [
      "Conducted hackathons with 1000+ participants",
      "Organized public lectures and competitions",
      "Competed in 6+ hackathons and CTF events",
    ],
    skills: ["Full-stack Development", "Community Leadership", "Event Organization", "Security"],
  },  
]
