export type ID = string

export type AgentMode = 'fully_autonomous' | 'supervised' | 'paused'
export type ActivityType = 'email' | 'invoice' | 'shipping' | 'order' | 'workflow' | 'risk'
export type ActivityStatus = 'done' | 'pending' | 'needs_review' | 'failed'

export interface UserProfile {
  id: ID
  email: string
  name: string
  workspaceName: string
  avatarUrl?: string
}

export interface AuthSession {
  user: UserProfile
  accessToken: string
  provider: 'supabase' | 'mock'
  expiresAt: string
}

export interface DashboardStats {
  savedHoursToday: number
  savedHoursWeek: number
  ordersProcessed: number
  emailsAnswered: number
  invoicesSent: number
  avgConfidence: number
  riskEvents: number
  costSavedToday: number
}

export interface ActivityItem {
  id: ID
  type: ActivityType
  title: string
  description: string
  source: string
  createdAt: string
  status: ActivityStatus
  confidence: number
  moneyImpactEur?: number
}

export interface AgentStatus {
  mode: AgentMode
  uptimePercent: number
  currentTask: string
  queueDepth: number
  autonomyScore: number
  guardrails: string[]
}

export type AgentActionKind =
  | 'send_email'
  | 'create_invoice'
  | 'reply_customer'
  | 'book_shipping'
  | 'escalate_human'
  | 'summarize_inbox'

export interface AgentCommand {
  prompt: string
  workspaceId: string
}

export interface AgentActionResult {
  id: ID
  kind: AgentActionKind
  title: string
  summary: string
  status: 'executed' | 'requires_approval' | 'blocked'
  confidence: number
  createdAt: string
  payloadPreview: Record<string, string | number | boolean>
}

export type IntegrationKey =
  | 'shopify'
  | 'woocommerce'
  | 'gmail'
  | 'superfaktura'
  | 'idoklad'
  | 'packeta'
  | 'gls'
  | 'instagram'
  | 'facebook'
  | 'upgates'
export type IntegrationCategory =
  | 'commerce'
  | 'email'
  | 'accounting'
  | 'shipping'
  | 'social'
  | 'support'

export interface Integration {
  id: IntegrationKey
  name: string
  description: string
  category: IntegrationCategory
  connected: boolean
  health: 'healthy' | 'degraded' | 'offline'
  lastSyncAt: string
  scopes: string[]
  monthlyActions: number
  latencyMs: number
}

export type InboxSource = 'gmail' | 'shopify' | 'woocommerce' | 'instagram' | 'support'
export type InboxCategory =
  | 'complaint'
  | 'invoice'
  | 'shipping'
  | 'returns'
  | 'lead'
  | 'vip'
  | 'spam'

export interface UnifiedInboxItem {
  id: ID
  source: InboxSource
  sender: string
  subject: string
  preview: string
  category: InboxCategory
  priority: 'low' | 'medium' | 'high' | 'critical'
  sentiment: 'positive' | 'neutral' | 'negative'
  status: 'auto_replied' | 'queued' | 'needs_human' | 'closed'
  aiDraft?: string
  receivedAt: string
  orderRef?: string
  valueEur?: number
}

export type WorkflowNodeType = 'trigger' | 'action' | 'condition' | 'approval'
export type WorkflowConnector =
  | 'gmail'
  | 'shopify'
  | 'woocommerce'
  | 'superfaktura'
  | 'idoklad'
  | 'packeta'
  | 'gls'
  | 'instagram'
  | 'agent'

export interface WorkflowNode {
  id: ID
  type: WorkflowNodeType
  connector: WorkflowConnector
  label: string
  description: string
  x: number
  y: number
  status: 'idle' | 'running' | 'success' | 'warning'
}

export interface WorkflowEdge {
  id: ID
  from: ID
  to: ID
}

export interface WorkflowGraph {
  id: ID
  name: string
  description: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  updatedAt: string
}

export interface AnalyticsPoint {
  date: string
  savedHours: number
  costSaved: number
  handledTasks: number
  accuracy: number
}
