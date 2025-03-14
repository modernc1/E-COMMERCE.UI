import { GetCategory } from './GetCategory';
export interface GetGender
{
  id: string;
  name: string;
  categories: GetCategory[];
}
