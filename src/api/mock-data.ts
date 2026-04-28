import { createLinearEdges } from '@/lib/action-graph/engine';
import type {
  ActivityItem,
  AgentStatus,
  AnalyticsPoint,
  DashboardStats,
  Integration,
  UnifiedInboxItem,
  WorkflowGraph,
  WorkflowNode
} from '@/types/domain';

const now = Date.now();
const minutesAgo = (minutes: number) => new Date(now - minutes * 60_000).toISOString();
const daysAgo = (days: number) => new Date(now - days * 86_400_000).toISOString();

export const dashboardStats: DashboardStats = {
  savedHoursToday: 6.8,
  savedHoursWeek: 34.5,
  ordersProcessed: 184,
  emailsAnswered: 72,
  invoicesSent: 49,
  avgConfidence: 94.2,
  riskEvents: 3,
  costSavedToday: 612
};

export const agentStatus: AgentStatus = {
  mode: 'fully_autonomous',
  uptimePercent: 99.87,
  currentTask: 'Pairing Packeta labels with Shopify paid orders',
  queueDepth: 17,
  autonomyScore: 91,
  guardrails: ['Refunds require human approval', 'Accounting mutations are audit-logged', 'Low confidence replies are queued', 'VIP customer complaints escalate']
};

export const activityFeed: ActivityItem[] = [
  {
    id: 'act_001',
    type: 'shipping',
    title: 'Packeta labels created',
    description: 'Generated 16 pickup-point shipments for orders SK-10492 to SK-10508.',
    source: 'Packeta + Shopify',
    createdAt: minutesAgo(6),
    status: 'done',
    confidence: 98,
    moneyImpactEur: 44
  },
  {
    id: 'act_002',
    type: 'invoice',
    title: 'SuperFaktura invoices issued',
    description: 'Issued VAT invoices for paid B2B orders from Brno, Žilina and Košice.',
    source: 'SuperFaktura',
    createdAt: minutesAgo(18),
    status: 'done',
    confidence: 96,
    moneyImpactEur: 320
  },
  {
    id: 'act_003',
    type: 'email',
    title: 'Warranty complaint drafted',
    description: 'Prepared polite-but-firm reply for customer asking whether a chewed cable is “factory condition”. Humanity limps on.',
    source: 'Gmail',
    createdAt: minutesAgo(31),
    status: 'needs_review',
    confidence: 78
  },
  {
    id: 'act_004',
    type: 'order',
    title: 'WooCommerce payment reconciled',
    description: 'Matched bank reference VS20260428-781 with order CZ-77821.',
    source: 'WooCommerce + iDoklad',
    createdAt: minutesAgo(46),
    status: 'done',
    confidence: 94,
    moneyImpactEur: 129
  },
  {
    id: 'act_005',
    type: 'risk',
    title: 'Refund blocked by guardrail',
    description: 'Refund request exceeded autonomous threshold. Sent to human queue before accounting becomes modern art.',
    source: 'Agent Guardrails',
    createdAt: minutesAgo(61),
    status: 'pending',
    confidence: 82
  }
];

export const integrations: Integration[] = [
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Orders, customers, refunds, fulfillment events and webhook ingestion for paid orders.',
    category: 'commerce',
    connected: true,
    health: 'healthy',
    lastSyncAt: minutesAgo(3),
    scopes: ['read_orders', 'write_fulfillments', 'read_customers'],
    monthlyActions: 18420,
    latencyMs: 140
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Order sync, stock updates and payment matching for WordPress stores.',
    category: 'commerce',
    connected: false,
    health: 'offline',
    lastSyncAt: daysAgo(9),
    scopes: ['read_orders', 'write_orders', 'read_products'],
    monthlyActions: 0,
    latencyMs: 0
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Unified customer email inbox with intent classification and supervised auto-replies.',
    category: 'email',
    connected: true,
    health: 'healthy',
    lastSyncAt: minutesAgo(1),
    scopes: ['gmail.readonly', 'gmail.send', 'gmail.modify'],
    monthlyActions: 9321,
    latencyMs: 88
  },
  {
    id: 'superfaktura',
    name: 'SuperFaktúra',
    description: 'Slovak invoice creation, VAT profiles, proforma invoices and accounting exports.',
    category: 'accounting',
    connected: true,
    health: 'healthy',
    lastSyncAt: minutesAgo(12),
    scopes: ['invoices.create', 'customers.read', 'payments.match'],
    monthlyActions: 3120,
    latencyMs: 220
  },
  {
    id: 'idoklad',
    name: 'iDoklad',
    description: 'Czech invoice workflows, payment pairing and customer/company register lookup.',
    category: 'accounting',
    connected: false,
    health: 'offline',
    lastSyncAt: daysAgo(4),
    scopes: ['issued_invoices', 'contacts', 'payments'],
    monthlyActions: 0,
    latencyMs: 0
  },
  {
    id: 'packeta',
    name: 'Packeta',
    description: 'Pickup-point delivery, barcode labels, tracking events and parcel status sync.',
    category: 'shipping',
    connected: true,
    health: 'degraded',
    lastSyncAt: minutesAgo(28),
    scopes: ['parcel.create', 'label.download', 'tracking.read'],
    monthlyActions: 5411,
    latencyMs: 430
  },
  {
    id: 'gls',
    name: 'GLS',
    description: 'Courier labels, parcel tracking, pickup manifests and cross-border delivery.',
    category: 'shipping',
    connected: false,
    health: 'offline',
    lastSyncAt: daysAgo(12),
    scopes: ['shipments.create', 'labels.read', 'tracking.read'],
    monthlyActions: 0,
    latencyMs: 0
  },
  {
    id: 'instagram',
    name: 'Instagram DMs',
    description: 'Message triage for social selling, lead capture and angry emoji containment.',
    category: 'social',
    connected: true,
    health: 'healthy',
    lastSyncAt: minutesAgo(4),
    scopes: ['messages.read', 'messages.reply', 'profile.read'],
    monthlyActions: 1450,
    latencyMs: 172
  },
  {
    id: 'upgates',
    name: 'Upgates',
    description: 'CZ/SK e-shop connector for orders, product feeds and customer synchronization.',
    category: 'commerce',
    connected: false,
    health: 'offline',
    lastSyncAt: daysAgo(20),
    scopes: ['orders', 'products', 'customers'],
    monthlyActions: 0,
    latencyMs: 0
  }
];

export const inboxItems: UnifiedInboxItem[] = [
  {
    id: 'msg_001',
    source: 'gmail',
    sender: 'Martina Kováčová <martina.kovacova@example.sk>',
    subject: 'Kde je moja zásielka SK-10498?',
    preview: 'Dobrý deň, zásielka mala byť v Packete včera, ale stále nevidím žiadny pohyb. Prosím o preverenie.',
    category: 'shipping',
    priority: 'high',
    sentiment: 'negative',
    status: 'queued',
    aiDraft: 'Dobrý deň, Martina, preverili sme zásielku SK-10498. Podľa Packety bola oneskorená pri triedení v depe Bratislava. Očakávané doručenie je zajtra. Pošleme tracking link a ospravedlnenie.',
    receivedAt: minutesAgo(8),
    orderRef: 'SK-10498',
    valueEur: 86
  },
  {
    id: 'msg_002',
    source: 'shopify',
    sender: 'Shopify Flow',
    subject: 'High-value order paid: SK-10512',
    preview: 'Order SK-10512 has been paid. Customer requested invoice to company: Tatra Elektro s.r.o., VAT ID SK2120...',
    category: 'invoice',
    priority: 'medium',
    sentiment: 'neutral',
    status: 'auto_replied',
    receivedAt: minutesAgo(22),
    orderRef: 'SK-10512',
    valueEur: 1240
  },
  {
    id: 'msg_003',
    source: 'instagram',
    sender: '@lucia.fit.sk',
    subject: 'DM: Spolupráca / veľkoobchod',
    preview: 'Ahojte, beriete veľkoobchodné objednávky pre fitness štúdio v Nitre? Potrebujeme pravidelne 30-50 ks mesačne.',
    category: 'lead',
    priority: 'medium',
    sentiment: 'positive',
    status: 'queued',
    aiDraft: 'Ahoj Lucia, áno, veľkoobchod riešime. Pošleme cenník a krátky formulár pre pravidelné objednávky.',
    receivedAt: minutesAgo(37),
    valueEur: 950
  },
  {
    id: 'msg_004',
    source: 'support',
    sender: 'Petr Novák <petr.novak@example.cz>',
    subject: 'Reklamace: poškozený balík GLS CZ-77821',
    preview: 'Balík dorazil otevřený a produkt je poškozený. Prosím okamžité řešení, jinak dávám negativní hodnocení.',
    category: 'complaint',
    priority: 'critical',
    sentiment: 'negative',
    status: 'needs_human',
    aiDraft: 'Dobrý den, Petře, omlouváme se za komplikaci. Prosíme o fotografii obalu a produktu. Případ předáváme reklamačnímu týmu a připravíme výměnu.',
    receivedAt: minutesAgo(44),
    orderRef: 'CZ-77821',
    valueEur: 179
  },
  {
    id: 'msg_005',
    source: 'woocommerce',
    sender: 'WooCommerce',
    subject: 'Unpaid order reminder CZ-77830',
    preview: 'Customer selected bank transfer but payment has not been matched after 48 hours.',
    category: 'invoice',
    priority: 'low',
    sentiment: 'neutral',
    status: 'queued',
    receivedAt: minutesAgo(52),
    orderRef: 'CZ-77830',
    valueEur: 64
  },
  {
    id: 'msg_006',
    source: 'gmail',
    sender: 'VIP: Ján Hrčka <jan.hrcka@example.sk>',
    subject: 'Prosím o urgentný dobropis',
    preview: 'Potrebujem dobropis k faktúre SF-2026-0418 ešte dnes, účtovníctvo nám horí. Ako vždy, v piatok o 16:58.',
    category: 'vip',
    priority: 'high',
    sentiment: 'neutral',
    status: 'needs_human',
    aiDraft: 'Dobrý deň, Ján, podklady máme pripravené. Keďže ide o dobropis, posielame to na rýchle schválenie účtovníctvu.',
    receivedAt: minutesAgo(67),
    orderRef: 'SF-2026-0418',
    valueEur: 410
  }
];

const workflowNodes: WorkflowNode[] = [
  {
    id: 'node_gmail',
    type: 'trigger',
    connector: 'gmail',
    label: 'Gmail: New support email',
    description: 'Classify incoming Gmail conversations by intent and sentiment.',
    x: 60,
    y: 120,
    status: 'success'
  },
  {
    id: 'node_shopify',
    type: 'action',
    connector: 'shopify',
    label: 'Shopify: Lookup order',
    description: 'Find the matching order, customer and fulfillment state.',
    x: 350,
    y: 120,
    status: 'success'
  },
  {
    id: 'node_superfaktura',
    type: 'action',
    connector: 'superfaktura',
    label: 'SuperFaktúra: Create invoice',
    description: 'Generate invoice or proforma based on payment state.',
    x: 640,
    y: 120,
    status: 'running'
  },
  {
    id: 'node_packeta',
    type: 'action',
    connector: 'packeta',
    label: 'Packeta: Create label',
    description: 'Create shipment and attach tracking URL to customer email.',
    x: 930,
    y: 120,
    status: 'idle'
  },
  {
    id: 'node_approval',
    type: 'approval',
    connector: 'agent',
    label: 'Guardrail: Approval for refunds',
    description: 'Pause on refunds, discounts and accounting mutations.',
    x: 640,
    y: 340,
    status: 'warning'
  }
];

export const workflowGraph: WorkflowGraph = {
  id: 'wf_core_ops',
  name: 'Order-to-cash autonomous flow',
  description: 'Gmail → Shopify → SuperFaktúra → Packeta with approval guardrails for risky actions.',
  nodes: workflowNodes,
  edges: [
    ...createLinearEdges(workflowNodes.slice(0, 4)),
    { id: 'edge_shopify_approval', from: 'node_shopify', to: 'node_approval' },
    { id: 'edge_approval_superfaktura', from: 'node_approval', to: 'node_superfaktura' }
  ],
  updatedAt: minutesAgo(13)
};

export const analyticsPoints: AnalyticsPoint[] = Array.from({ length: 14 }, (_, index) => {
  const day = 13 - index;
  return {
    date: new Date(now - day * 86_400_000).toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit' }),
    savedHours: 3.8 + Math.sin(index / 2) * 1.2 + index * 0.27,
    costSaved: Math.round(280 + index * 34 + Math.cos(index) * 42),
    handledTasks: Math.round(80 + index * 9 + Math.sin(index) * 11),
    accuracy: Math.min(98.5, 88 + index * 0.55 + Math.sin(index / 3) * 1.8)
  };
});
