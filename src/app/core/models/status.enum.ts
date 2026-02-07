export enum Status {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export const STATUS_LABELS: Record<Status, string> = {
  [Status.PENDING]: 'Pendiente',
  [Status.IN_PROGRESS]: 'En Progreso',
  [Status.COMPLETED]: 'Completado',
  [Status.CANCELLED]: 'Cancelado'
};

export const STATUS_COLORS: Record<Status, string> = {
  [Status.PENDING]: '#f59e0b',
  [Status.IN_PROGRESS]: '#3b82f6',
  [Status.COMPLETED]: '#10b981',
  [Status.CANCELLED]: '#ef4444'
};
