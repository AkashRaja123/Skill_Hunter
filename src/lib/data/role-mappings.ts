/**
 * Maps technology domains to relevant job roles
 * Used to recommend job opportunities based on trending domains
 */

export interface RoleMapping {
  domain: string;
  roles: string[];
}

export const roleMappings: RoleMapping[] = [
  {
    domain: "AI & Machine Learning",
    roles: [
      "Machine Learning Engineer",
      "AI Engineer",
      "Data Scientist",
      "Prompt Engineer",
      "NLP Engineer",
      "AI Researcher",
      "Computer Vision Engineer",
      "ML Operations Engineer"
    ]
  },
  {
    domain: "Cloud Computing",
    roles: [
      "Cloud Architect",
      "Cloud Engineer",
      "DevOps Engineer",
      "Solutions Architect",
      "Infrastructure Engineer",
      "Site Reliability Engineer",
      "Cloud Security Engineer"
    ]
  },
  {
    domain: "Data Engineering",
    roles: [
      "Data Engineer",
      "ETL Developer",
      "Analytics Engineer",
      "Data Pipeline Engineer",
      "Big Data Engineer",
      "Data Architect"
    ]
  },
  {
    domain: "Web Development",
    roles: [
      "Full Stack Developer",
      "Frontend Engineer",
      "Backend Engineer",
      "Web Developer",
      "React Developer",
      "Node.js Developer",
      "Web Architect"
    ]
  },
  {
    domain: "Mobile Development",
    roles: [
      "Mobile Developer",
      "iOS Developer",
      "Android Developer",
      "React Native Developer",
      "Flutter Developer",
      "Cross-Platform Developer",
      "Mobile Architect"
    ]
  },
  {
    domain: "DevOps & SRE",
    roles: [
      "DevOps Engineer",
      "Site Reliability Engineer",
      "SRE Lead",
      "Platform Engineer",
      "Infrastructure Automation Engineer",
      "Deployment Engineer"
    ]
  },
  {
    domain: "Blockchain & Web3",
    roles: [
      "Blockchain Developer",
      "Smart Contract Developer",
      "Solidity Developer",
      "Web3 Engineer",
      "Blockchain Architect",
      "DeFi Developer",
      "Blockchain Security Engineer"
    ]
  },
  {
    domain: "Cybersecurity",
    roles: [
      "Security Engineer",
      "Cybersecurity Analyst",
      "Penetration Tester",
      "Security Architect",
      "InfoSec Engineer",
      "Threat Analyst",
      "Application Security Engineer"
    ]
  },
  {
    domain: "Quantum Computing",
    roles: [
      "Quantum Engineer",
      "Quantum Programmer",
      "Quantum Researcher",
      "Quantum Software Developer",
      "Quantum Algorithm Designer"
    ]
  },
  {
    domain: "Robotics & Automation",
    roles: [
      "Robotics Engineer",
      "Automation Engineer",
      "RPA Developer",
      "Controls Engineer",
      "Embedded Systems Engineer",
      "Robotics Researcher"
    ]
  },
  {
    domain: "Data Science & Analytics",
    roles: [
      "Data Scientist",
      "Analytics Engineer",
      "Business Analyst",
      "BI Developer",
      "Data Analyst",
      "Insights Engineer"
    ]
  },
  {
    domain: "IoT & Edge Computing",
    roles: [
      "IoT Engineer",
      "Embedded Systems Engineer",
      "Edge Computing Engineer",
      "IoT Architect",
      "Firmware Engineer",
      "IoT Security Engineer"
    ]
  },
  {
    domain: "Low-Code/No-Code",
    roles: [
      "Low-Code Developer",
      "Citizen Developer",
      "Power Platform Developer",
      "Automation Specialist",
      "Business Process Analyst"
    ]
  },
  {
    domain: "AR & VR",
    roles: [
      "AR Developer",
      "VR Developer",
      "XR Engineer",
      "3D Graphics Engineer",
      "Spatial Computing Engineer",
      "Metaverse Developer",
      "Unity Developer",
      "Unreal Engine Developer"
    ]
  },
  {
    domain: "Database Tech",
    roles: [
      "Database Engineer",
      "Database Administrator",
      "Data Architect",
      "Database Developer",
      "NoSQL Specialist",
      "Database Performance Engineer"
    ]
  },
  {
    domain: "API Development",
    roles: [
      "API Developer",
      "Backend Engineer",
      "API Architect",
      "Integration Engineer",
      "Full Stack Developer"
    ]
  }
];

/**
 * Get job roles for a domain
 */
export function getRolesForDomain(domain: string): string[] {
  const mapping = roleMappings.find((m) => m.domain === domain);
  return mapping ? mapping.roles : [];
}

/**
 * Get all job roles
 */
export function getAllRoles(): string[] {
  const roles = new Set<string>();
  roleMappings.forEach((mapping) => {
    mapping.roles.forEach((role) => roles.add(role));
  });
  return Array.from(roles).sort();
}
