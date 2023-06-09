import { ProjectInterface } from 'interfaces/project';
import { UserInterface } from 'interfaces/user';

export interface ExcavatorInterface {
  id?: string;
  name: string;
  owner_id: string;
  project?: ProjectInterface[];
  user?: UserInterface;
  _count?: {
    project?: number;
  };
}
