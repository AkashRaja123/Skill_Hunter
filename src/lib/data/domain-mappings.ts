/**
 * Maps technology keywords to domain categories
 * Used for trend analysis and job role recommendations
 */

export interface DomainMapping {
  domain: string;
  keywords: string[];
  category: string;
}

export const domainMappings: DomainMapping[] = [
  {
    domain: "AI & Machine Learning",
    keywords: [
      "artificial intelligence",
      "machine learning",
      "deep learning",
      "neural networks",
      "llm",
      "large language model",
      "transformers",
      "gpt",
      "bert",
      "natural language processing",
      "nlp",
      "generative ai",
      "gen ai",
      "prompt engineering",
      "fine-tuning",
      "ai training",
      "ai safety",
      "alignment",
      "ai ethics"
    ],
    category: "Software Development"
  },
  {
    domain: "Cloud Computing",
    keywords: [
      "cloud",
      "aws",
      "azure",
      "gcp",
      "kubernetes",
      "docker",
      "containerization",
      "microservices",
      "serverless",
      "lambda",
      "cloud infrastructure",
      "devops",
      "ci/cd",
      "infrastructure as code",
      "terraform",
      "cloudformation",
      "elastic computing"
    ],
    category: "Infrastructure"
  },
  {
    domain: "Data Engineering",
    keywords: [
      "big data",
      "data engineering",
      "data pipeline",
      "etl",
      "data warehouse",
      "data lake",
      "spark",
      "hadoop",
      "kafka",
      "streaming",
      "snowflake",
      "bigquery",
      "dbt",
      "airflow",
      "data processing"
    ],
    category: "Data"
  },
  {
    domain: "Web Development",
    keywords: [
      "web development",
      "react",
      "vue",
      "angular",
      "next.js",
      "node.js",
      "full stack",
      "frontend",
      "backend",
      "rest api",
      "graphql",
      "web framework",
      "javascript",
      "typescript",
      "html",
      "css",
      "web framework"
    ],
    category: "Software Development"
  },
  {
    domain: "Mobile Development",
    keywords: [
      "mobile",
      "ios",
      "android",
      "react native",
      "flutter",
      "cross-platform",
      "swift",
      "kotlin",
      "app development",
      "mobiledevelopment"
    ],
    category: "Software Development"
  },
  {
    domain: "DevOps & SRE",
    keywords: [
      "devops",
      "site reliability engineering",
      "sre",
      "monitoring",
      "observability",
      "prometheus",
      "grafana",
      "logging",
      "datadog",
      "new relic",
      "incident management",
      "automation",
      "deployment",
      "release management"
    ],
    category: "Infrastructure"
  },
  {
    domain: "Blockchain & Web3",
    keywords: [
      "blockchain",
      "web3",
      "cryptocurrency",
      "crypto",
      "ethereum",
      "bitcoin",
      "smart contracts",
      "solidity",
      "defi",
      "nft",
      "distributed ledger",
      "consensus",
      "decentralized"
    ],
    category: "Emerging Tech"
  },
  {
    domain: "Cybersecurity",
    keywords: [
      "cybersecurity",
      "security",
      "encryption",
      "penetration testing",
      "vulnerability",
      "zero trust",
      "identity and access management",
      "iam",
      "cloud security",
      "secure coding",
      "threat detection",
      "incident response"
    ],
    category: "Security"
  },
  {
    domain: "Quantum Computing",
    keywords: [
      "quantum",
      "quantum computing",
      "quantum algorithms",
      "qubits",
      "quantum mechanics",
      "quantum optimization",
      "ibm quantum",
      "qiskit"
    ],
    category: "Emerging Tech"
  },
  {
    domain: "Robotics & Automation",
    keywords: [
      "robotics",
      "automation",
      "robot",
      "robotic process automation",
      "rpa",
      "industrial automation",
      "autonomous systems",
      "control systems",
      "robotics framework"
    ],
    category: "Emerging Tech"
  },
  {
    domain: "Data Science & Analytics",
    keywords: [
      "data science",
      "data analytics",
      "analytics",
      "business intelligence",
      "bi",
      "tableau",
      "power bi",
      "statistics",
      "predictive analytics",
      "data visualization"
    ],
    category: "Data"
  },
  {
    domain: "IoT & Edge Computing",
    keywords: [
      "iot",
      "internet of things",
      "edge computing",
      "edge ai",
      "iot devices",
      "embedded systems",
      "embedded",
      "sensors",
      "mqtt",
      "coap",
      "iot security"
    ],
    category: "Emerging Tech"
  },
  {
    domain: "Low-Code/No-Code",
    keywords: [
      "low-code",
      "no-code",
      "low code",
      "no code",
      "visual development",
      "citizen developer",
      "rapid development",
      "zapier",
      "power platform"
    ],
    category: "Software Development"
  },
  {
    domain: "AR & VR",
    keywords: [
      "augmented reality",
      "ar",
      "virtual reality",
      "vr",
      "metaverse",
      "spatial computing",
      "xr",
      "mixed reality",
      "3d graphics",
      "immersive"
    ],
    category: "Emerging Tech"
  },
  {
    domain: "Database Tech",
    keywords: [
      "database",
      "sql",
      "nosql",
      "mongodb",
      "postgresql",
      "mysql",
      "redis",
      "dynamodb",
      "cassandra",
      "graph database",
      "neo4j",
      "database design",
      "data modeling"
    ],
    category: "Data"
  },
  {
    domain: "API Development",
    keywords: [
      "api",
      "rest",
      "graphql",
      "openapi",
      "swagger",
      "api gateway",
      "api design",
      "api management",
      "apigee",
      "kong"
    ],
    category: "Software Development"
  }
];

/**
 * Get domain for a keyword
 */
export function getDomainForKeyword(keyword: string): string | null {
  const lowerKeyword = keyword.toLowerCase().trim();

  for (const mapping of domainMappings) {
    if (mapping.keywords.some((k) => k.toLowerCase() === lowerKeyword)) {
      return mapping.domain;
    }
  }

  return null;
}

/**
 * Get all domains
 */
export function getAllDomains(): string[] {
  return domainMappings.map((m) => m.domain);
}

/**
 * Get keywords for a domain
 */
export function getKeywordsForDomain(domain: string): string[] {
  const mapping = domainMappings.find((m) => m.domain === domain);
  return mapping ? mapping.keywords : [];
}
