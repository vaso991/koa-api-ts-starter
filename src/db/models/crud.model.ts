import { Model, ModelObject } from 'objection';
import { timestampPlugin } from 'objection-timestamps';

class CrudModel extends timestampPlugin()(Model) {
  static tableName = 'Crud';

  static timestamp = true;

  id: string;
  param1: string;
  param2: string;
  updated_at: string;
  created_at: string;
}

type CrudModelType = ModelObject<CrudModel>;
export default CrudModel;
export { CrudModel };
export type { CrudModelType };
