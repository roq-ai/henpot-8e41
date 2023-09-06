import { EventInterface } from 'interfaces/event';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface UsageTrackingInterface {
  id?: string;
  event_id: string;
  user_id: string;
  usage_date: any;
  usage_time: any;
  usage_duration: number;
  created_at?: any;
  updated_at?: any;

  event?: EventInterface;
  user?: UserInterface;
  _count?: {};
}

export interface UsageTrackingGetQueryInterface extends GetQueryInterface {
  id?: string;
  event_id?: string;
  user_id?: string;
}
