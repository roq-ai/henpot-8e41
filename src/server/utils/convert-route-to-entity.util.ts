const mapping: Record<string, string> = {
  events: 'event',
  organizations: 'organization',
  'performance-assessments': 'performance_assessment',
  reservations: 'reservation',
  'usage-trackings': 'usage_tracking',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
