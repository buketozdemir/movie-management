import mongoose, { FilterQuery, Model } from 'mongoose';
import { isMongoId, isNumberString } from 'class-validator';
import { AggregateQueryParams, BaseQueryParams, PageQueryParams, PaginationResult, UpdateArrayItemParams } from '../interfaces/data-access';
import { SORT_ORDER } from '../constants';

export class BaseDataAccess<T> {
  model: Model<T>;
  models: Readonly<{ [index: string]: Model<any> }>;

  constructor(repository: Model<T>) {
    this.model = repository;
    this.models = this.getMongoModels();
  }

  async findOne(params: BaseQueryParams<T>): Promise<T> {
    const { filter, projection } = params;
    params.projection = (projection ? projection : this.getDefaultFields()) || '_id';
    const preparedProjection = this.basePrepareProjection(params.projection);
    const preparedFilter = this.prepareFilter(filter);
    return this.model.findOne(preparedFilter, preparedProjection);
  }

  async get(params: PageQueryParams<T>): Promise<T[] | PaginationResult<T>> {
    const { filter, projection, limit, page, sort } = params;
    params.projection = (projection ? projection : this.getDefaultFields()) || '_id';
    if (this.mustBeAggregate(params.projection, page, limit)) {
      const result: any = await this.model.aggregate(this.prepareAggregateQuery(params));
      if (page) {
        return {
          data: result && result.length && result[0].data ? result[0].data : null,
          page,
          limit,
          totalCount: result && result.length && result[0].metadata && result[0].metadata.length ? result[0].metadata[0].totalCount : 0,
        };
      }
      return result;
    } else {
      let find = this.model.find(this.prepareFilter(filter), params.projection);
      if (sort) {
        find = find.sort(sort);
      }
      if (page && limit) {
        find = find.skip((page - 1) * limit).limit(limit);
      }
      return find;
    }
  }

  async aggregate(params: AggregateQueryParams) {
    const { pipeline, sort, sortOrder, page, limit, projection } = params;
    const query: any[] = [...pipeline];
    if (projection) {
      query.push({
        $project: this.basePrepareProjection(projection),
      });
    }
    if (sort) {
      if (typeof sort === 'string') {
        const splitSort = sort.split(' ');
        const sortObj = {};

        splitSort.forEach((item) => {
          sortObj[item] = sortOrder || SORT_ORDER.DEFAULT;
        });

        query.push({
          $sort: sortObj,
        });
      }
    }
    if (page && limit) {
      query.push({
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
      });
    }
    const result: any = await this.model.aggregate(query);
    if (page && limit) {
      return {
        data: result && result.length && result[0].data ? result[0].data : null,
        page,
        limit,
        totalCount: result && result.length && result[0].metadata && result[0].metadata.length ? result[0].metadata[0].totalCount : 0,
      };
    }
    return result;
  }

  prepareUpdateArrayItem(params: UpdateArrayItemParams) {
    const { fieldName, payload, filterName = 'item' } = params;
    const value = {};
    Object.keys(payload).forEach((field) => {
      value[fieldName + '.$[' + filterName + '].' + field] = payload[field];
    });
    return value;
  }

  async create(payload: object) {
    return this.model.create(payload);
  }

  async createMany(payload: object[]) {
    return this.model.bulkWrite(payload.map((item) => ({ insertOne: { document: item } })));
  }

  async updateOne(filter: object, payload: object, options?: any) {
    return this.model.updateOne(filter, payload, options);
  }

  async deleteOne(filter: object) {
    return this.model.deleteOne(filter);
  }

  private mustBeAggregate(projection?: string | object, page?: number, limit?: number) {
    return (projection && this.isNestedFields(projection)) || (page && limit);
  }

  private isNestedFields(fields?: string | object) {
    if (typeof fields === 'string') {
      return fields.indexOf('.') > 0;
    } else {
      let result = false;
      for (const key of Object.keys(fields)) {
        if (typeof fields[key] === 'object') {
          result = true;
        }
      }
      return result;
    }
  }

  private prepareAggregateQuery(params: PageQueryParams<T>) {
    const { filter, page, limit, sort, sortOrder } = params;
    const { projection } = params;
    const query = [];
    if (filter) {
      const preparedFilter = this.prepareFilter(filter);
      if (preparedFilter && Object.keys(preparedFilter).length) {
        query.push({ $match: preparedFilter });
      }
    }
    let project: any = {};
    if (projection) {
      project = { $project: this.basePrepareProjection(projection) };
      query.push(project);
    }
    if (sort) {
      if (typeof sort === 'string') {
        const splitSort = sort.split(' ');
        const sortObj = {};

        splitSort.forEach((item) => {
          sortObj[item] = sortOrder;
        });

        query.push({
          $sort: sortObj,
        });
      }
    }
    if (page && limit) {
      query.push({
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
      });
    }

    if (Object.keys(project).length) {
      if (project?.$project?.id) {
        project.$project.id = '$_id';
        project.$project._id = 0;
      }
    }

    return query;
  }

  private basePrepareProjection(projection: any): object {
    const fieldList = {};

    const selectedFields = projection.split(' ');

    selectedFields.forEach((field: string) => {
      fieldList[field] = 1;
    });
    fieldList['id'] = '$_id';
    return fieldList;
  }

  prepareFilter(filter: FilterQuery<T>) {
    const filterObject: any = {};
    if (!filter || Object.keys(filter).length === 0) {
      return filterObject;
    }
    for (const key of Object.keys(filter)) {
      const fieldModelInfo = this.model.schema.path(key);
      if (filter[key] !== undefined && isMongoId(filter[key].toString()) && !Array.isArray(filter[key])) {
        filterObject[key] = new mongoose.Types.ObjectId(filter[key]);
      } else if (isNumberString(filter[key])) {
        if (fieldModelInfo.instance === 'String') {
          filterObject[key] = filter[key];
        } else {
          filterObject[key] = Number(filter[key]);
        }
      } else if (typeof filter[key] === 'string') {
        filterObject[key] = { $regex: filter[key], $options: 'i' };
      } else if (typeof filter[key] === 'object' && key.indexOf('$') > -1) {
        filterObject[key] = filter[key];
      } else if (Array.isArray(filter[key])) {
        if (filter[key].length && (isMongoId(filter[key][0]) || typeof filter[key][0] === 'string')) {
          const items = [];
          filter[key].forEach((item: string) => {
            items.push(isMongoId(filter[key][0]) ? new mongoose.Types.ObjectId(item) : item);
          });
          filterObject[key] = { $in: items };
        } else {
          filterObject[key] = filter[key];
        }
      } else if (typeof filter[key] === 'object') {
        for (const subKey of Object.keys(filter[key])) {
          filterObject[key] = filterObject[key] || {};
          if (isMongoId(filter[key][subKey])) {
            filterObject[key][subKey] = new mongoose.Types.ObjectId(filter[key][subKey]);
          } else {
            filterObject[key][subKey] = filter[key][subKey];
          }
        }
      } else if (filter[key] !== undefined) {
        filterObject[key] = filter[key];
      }
    }
    return filterObject;
  }

  private getDefaultFields() {
    const paths = this.model.schema.paths;
    const defaultFields = [];
    for (const key of Object.keys(paths)) {
      if (paths[key].options.defaultField) {
        if (paths[key].options.childFields && Array.isArray(paths[key].options.childFields)) {
          paths[key].options.childFields.forEach((item: string) => {
            defaultFields.push(key + '.' + item);
          });
        } else {
          defaultFields.push(key);
        }
      }
    }
    return defaultFields.join(' ');
  }

  private getMongoModels() {
    let models = {};
    mongoose.connections.forEach((connection) => {
      models = { ...models, ...connection.models };
    });
    return models;
  }
}
