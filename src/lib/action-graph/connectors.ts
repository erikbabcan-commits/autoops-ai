import { Bot, FileText, Instagram, Mail, PackageCheck, ShoppingBag, Truck } from 'lucide-react';
import type { WorkflowConnector, WorkflowNodeType } from '@/types/domain';

export interface ConnectorTemplate {
  connector: WorkflowConnector;
  type: WorkflowNodeType;
  label: string;
  description: string;
  accent: 'cyan' | 'purple' | 'green' | 'amber';
  icon: typeof Mail;
}

export const connectorTemplates: ConnectorTemplate[] = [
  {
    connector: 'gmail',
    type: 'trigger',
    label: 'Gmail: New customer email',
    description: 'Trigger when a customer email matches intent rules.',
    accent: 'cyan',
    icon: Mail
  },
  {
    connector: 'shopify',
    type: 'trigger',
    label: 'Shopify: Paid order',
    description: 'Start automation when a new paid order arrives.',
    accent: 'green',
    icon: ShoppingBag
  },
  {
    connector: 'superfaktura',
    type: 'action',
    label: 'SuperFaktura: Create invoice',
    description: 'Issue an invoice with VAT profile and order metadata.',
    accent: 'purple',
    icon: FileText
  },
  {
    connector: 'packeta',
    type: 'action',
    label: 'Packeta: Create shipment',
    description: 'Book pickup point delivery and generate shipping label.',
    accent: 'amber',
    icon: PackageCheck
  },
  {
    connector: 'gls',
    type: 'action',
    label: 'GLS: Courier pickup',
    description: 'Create parcel and schedule courier collection.',
    accent: 'cyan',
    icon: Truck
  },
  {
    connector: 'instagram',
    type: 'trigger',
    label: 'Instagram: New DM',
    description: 'Classify incoming social message and map it to customer context.',
    accent: 'purple',
    icon: Instagram
  },
  {
    connector: 'agent',
    type: 'approval',
    label: 'AI Guardrail: Human approval',
    description: 'Pause on risky operations like refunds or accounting changes.',
    accent: 'amber',
    icon: Bot
  }
];
