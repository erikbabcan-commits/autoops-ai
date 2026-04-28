import { atom } from 'jotai';
import type { InboxCategory, WorkflowGraph, WorkflowNode } from '@/types/domain';

export const selectedInboxCategoryAtom = atom<InboxCategory | 'all'>('all');
export const selectedWorkflowNodeAtom = atom<WorkflowNode | null>(null);
export const activeWorkflowAtom = atom<WorkflowGraph | null>(null);
export const agentSidebarOpenAtom = atom(true);
