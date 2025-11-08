export interface Project {
  id: string
  name: string
  description: string
  longDescription: string
  category: "Professional" | "Personal" | "Open Source"
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
      "Written in Rust, a personalized server access management tool that tracks all administrative rights attempts (like sudo and su) on the server via SSH. Allows/denies access based on user public keys and logs all activity in Slack messages. Provides easy granting/revoking access to 4 servers for 50+ SDSLabs team members through pull requests.",
    category: "Professional",
    tech: ["Rust", "SSH", "Linux", "Slack API"],
    date: "Dec 2024 - Present",
    github: "https://github.com/Arshdeep54",
  },
  {
    id: "pgmoneta",
    name: "pgmoneta",
    description: "High-performance PostgreSQL connection pooler",
    longDescription:
      "A lightweight, high-performance connection pooler for PostgreSQL designed for low-latency environments and efficient resource usage. Added Docker support for containerized workflows and integrated FreeBSD support into the CI pipeline to expand to 3 platforms. Implemented load-save approach for struct backup flow, reducing 7+ functions to 2.",
    category: "Open Source",
    tech: ["C", "PostgreSQL", "Docker", "CI/CD"],
    date: "Mar 2025 - Jul 2025",
    github: "https://github.com/Arshdeep54",
  },
  {
    id: "meridb",
    name: "MeriDB",
    description: "SQL database built from scratch in Rust",
    longDescription:
      "SQL database built from scratch in Rust with a custom lexer, parser, storage engine, and terminal-style query interface. Implemented paged storage (pages/records) and modular architecture across parsing, execution, input handling, and storage. Roadmap includes B-Tree indexing, server mode, Dockerization, and extended SQL support.",
    category: "Personal",
    tech: ["Rust", "SQL", "Database Engine"],
    date: "2025 - Present",
    github: "https://github.com/Arshdeep54",
  },
  {
    id: "inomy",
    name: "Inomy",
    description: "AI-powered shopping assistant on Intent Protocol",
    longDescription:
      "Built Inomy, an AI-powered shopping assistant around the Intent Protocol. Contributed to Next.js frontend, smart contracts on Base chain, and ERC-20 token implementation. Worked on the complete DApp lifecycle from smart contract integration to frontend and backend deployment.",
    category: "Professional",
    tech: ["Solidity", "Next.js", "Web3", "Base Chain", "React"],
    date: "Dec 2024 - Jan 2025",
    github: "https://github.com/Arshdeep54",
  },
  {
    id: "labos-event-harvester",
    name: "Event Harvester",
    description: "Event aggregator for Luma and Cryptonomad",
    longDescription:
      "Built as part of Protocol Labs Dev Guild Cohort 3. Event aggregator for Luma and Cryptonomad with comprehensive data cleaning and Airtable integration. Processes and normalizes event data from multiple sources into a unified format.",
    category: "Professional",
    tech: ["JavaScript", "Airtable API", "Data Processing"],
    date: "Apr 2025 - Oct 2025",
  },
  {
    id: "ask-racha",
    name: "Ask Racha",
    description: "Docs Q&A with vector database retrieval",
    longDescription:
      "Docs Q&A system that parses documentation and repositories, embedding them into Qdrant (vector DB) for low-latency retrieval. Built a lightweight retrieval API that enables semantic search across documentation using vector embeddings.",
    category: "Professional",
    tech: ["Vector DB", "Qdrant", "Embeddings", "Python", "API"],
    date: "Apr 2025 - Oct 2025",
  },
  {
    id: "wasmedge-installer",
    name: "WasmEdge Installer",
    description: "Cross-platform installer with hardware detection",
    longDescription:
      "Implemented core features for cross-platform WasmEdge installer including remove, versioning, and plugin management. Added hardware/system detection for optimal runtime configuration (CPU features, GPU backends: CUDA/ROCm/OpenCL) with validation and tests. Strengthened reliability with checksum verification, documentation, and CI across Linux, macOS, and Windows.",
    category: "Open Source",
    tech: ["Rust", "Cross-platform", "CI/CD", "Hardware Detection"],
    date: "Sep 2025 - Nov 2025",
    github: "https://github.com/Arshdeep54",
  },
  {
    id: "sds-labs",
    name: "SDSLabs Developer",
    description: "Campus technology and open-source contributions",
    longDescription:
      "Involved in maintaining and developing applications for campus students and the internet. Regularly conducted hackathons (1000+ participants), public lectures, and competitions to foster technical culture on campus. Competed in 6+ hackathons and CTF events under SDSLabs team.",
    category: "Professional",
    tech: ["Full-stack", "Community", "CTF"],
    date: "Feb 2024 - Present",
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
    skills: ["Full Stack Development", "Community Leadership", "Event Organization", "Security"],
  },
]
