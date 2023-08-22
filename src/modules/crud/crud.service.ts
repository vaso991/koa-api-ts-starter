import CrudModel from '@App/db/models/crud.model';
import { CrudType } from './curd.schema';

export class CrudService {
  public static async Create(crudBody: CrudType) {
    const newCrud = await CrudModel.query().insert(crudBody);
    return newCrud;
  }

  public static async GetAll() {
    return CrudModel.query();
  }

  public static async GetById(id: string) {
    return CrudModel.query().findById(id).throwIfNotFound();
  }

  public static async Update(id: string, body: CrudType) {
    return await CrudModel.query()
      .patchAndFetchById(id, body)
      .throwIfNotFound();
  }

  public static async DeleteById(id: string) {
    return await CrudModel.query().deleteById(id).throwIfNotFound();
  }
}
