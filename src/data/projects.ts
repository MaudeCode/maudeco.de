export const projects = [
  {
    name: 'Talaria', kind: 'Assistant interfaces',
    summary: 'A native Apple app and web workspace for Hermes Agent.',
    description: 'Chat, tool results, files, and session controls across native Apple and browser interfaces. Shared contracts connect the clients and notification relay.',
    tech: 'SwiftUI · React · TypeScript · Python',
    github: 'https://github.com/MaudeCode/talaria',
  },
  {
    name: 'Kanvil', kind: 'Work for agents and people',
    summary: 'Self-hosted ticketing that gives agents and people a shared record of work.',
    description: 'Projects, tickets, ownership, and realtime events, with web and mobile apps for people and an MCP interface for agents. Work has a place to live beyond a chat.',
    tech: 'TypeScript · PostgreSQL · MCP',
    github: 'https://github.com/MaudeCode/kanvil',
  },
  {
    name: 'T3 Factory', kind: 'Coding-agent orchestration',
    summary: 'A local scheduler that turns ready tickets into bounded coding runs.',
    description: 'Connects Kanvil work to T3 Code in separate Git worktrees, with model selection, concurrency limits, quota checks, and a queue you can inspect.',
    tech: 'TypeScript · T3 Code · Kanvil · macOS',
    github: 'https://github.com/MaudeCode/t3-factory',
  },
  {
    name: 'Cowtail', kind: 'Alert investigations',
    summary: 'A record of what broke, what caused it, and what fixed it.',
    description: 'An alert investigation log and cluster-health dashboard with web and iPhone interfaces. Monitoring events keep their investigation history instead of disappearing into chat.',
    tech: 'React · Convex · Swift · Kubernetes',
    github: 'https://github.com/MaudeCode/cowtail',
  },
]
