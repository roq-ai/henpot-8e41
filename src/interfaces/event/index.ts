import { PerformanceAssessmentInterface } from 'interfaces/performance-assessment';
import { ReservationInterface } from 'interfaces/reservation';
import { UsageTrackingInterface } from 'interfaces/usage-tracking';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface EventInterface {
  id?: string;
  name: string;
  date: any;
  location: string;
  description: string;
  organizer_id: string;
  created_at?: any;
  updated_at?: any;
  performance_assessment?: PerformanceAssessmentInterface[];
  reservation?: ReservationInterface[];
  usage_tracking?: UsageTrackingInterface[];
  user?: UserInterface;
  _count?: {
    performance_assessment?: number;
    reservation?: number;
    usage_tracking?: number;
  };
}

export interface EventGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  location?: string;
  description?: string;
  organizer_id?: string;
}
