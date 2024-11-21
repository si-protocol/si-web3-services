import { applyDecorators, Type } from '@nestjs/common';
import { ApiBadRequestResponse, ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { Type as Transformer } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { omit, pick } from 'lodash';

export enum SortOrder {
  DESC = -1,
  ASC = 1,
}

export function prePagination(query: any) {
  const keys = ['size', 'page', 'sortBy', 'sortOrder', 'options'];
  const page = pick(query, keys) as ApiPaginationQuery;
  if (!page.options) page.options = {};
  return {
    where: omit(query, keys),
    page,
  };
}

export function getPaginationForMongo(pagination?: ApiPaginationQuery) {
  const cursor = {
    limit: pagination.size,
    skip: pagination.size * (pagination.page - 1),
    sortBy: pagination.sortBy,
    sortOrder: pagination.sortOrder,
  };
  return getCursor(cursor);
}

export function getPaginationForPrismaPaginate(pagination?: ApiPaginationQuery) {
  const pages = {
    limit: pagination.size,
    page: pagination.page,
    includePageCount: true,
  };
  const options: any = pagination.options || {};
  if (pagination.sortBy) {
    const sortBy = pagination?.sortBy || 'createdAt';
    const sortOrder = pagination?.sortOrder || SortOrder.DESC;
    options.sort = { [sortBy]: sortOrder };
  }
  return { pages, options }
}

export function getPaginationForPrisma(pagination?: ApiPaginationQuery) {
  const pages = {
    take: Number(pagination.size),
    skip: Number(pagination.size) * (Number(pagination.page) - 1),
  };
  const options: any = pagination.options || {};
  if (pagination.sortBy) {
    const sortBy = pagination?.sortBy || 'createdAt';
    const sortOrder = pagination?.sortOrder || SortOrder.DESC;
    options.sort = { [sortBy]: sortOrder };
  }
  return { pages, options }
}

export function getPagination(pagination?: ApiPaginationQuery) {
  return getPaginationForPrisma(pagination);
}

export function createPaginationMetaForMongo(total: number, options?: Partial<ApiPaginationQuery>) {
  let pages = 1;
  if (options?.size && total) pages = Math.ceil(total / options?.size);
  return {
    total,
    size: options?.size,
    page: options?.page,
    pages: pages,
  };
}

export function createPaginationMetaForPrisma(meta: any, options?: Partial<ApiPaginationQuery>) {
  return {
    total: meta.totalCount,
    size: options?.size,
    page: options?.page,
    pages: meta.pageCount,
  };
}

export function createPaginationMeta(meta: any, options?: Partial<ApiPaginationQuery>) {
  return createPaginationMetaForPrisma(meta, options);
}

export class ApiPaginationQuery {
  @ApiProperty({ required: false, example: 10, default: 10 })
  @IsInt()
  @Min(1)
  @Transformer(() => Number)
  size: number;

  @ApiProperty({ required: false, example: 1, default: 1 })
  @Transformer(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({ required: false, example: 'id' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false, enum: SortOrder, example: -1, default: -1 })
  @IsOptional()
  @Transformer(() => Number)
  @IsInt()
  sortOrder?: SortOrder;

  @ApiProperty({ required: false })
  options?: Record<string, any>;
}

export const ApiPaginationResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
          {
            properties: {
              meta: {
                type: 'object',
                properties: {
                  total: { type: 'number' },
                  size: { type: 'number', example: 10 },
                  page: { type: 'number', example: 1 },
                  pages: { type: 'number', example: 1 },
                },
              },
            },
          },
        ],
      },
    }),
  );
};

export function preCursor(query: any) {
  const keys = ['limit', 'skip', 'sortBy', 'sortOrder'];
  return {
    where: omit(query, keys),
    page: pick(query, keys) as ApiCursorQuery,
  };
}

export function getCursor(cursor?: ApiCursorQuery, ext?: Partial<ApiCursorQuery>) {
  let limit = cursor?.limit || ext?.limit || 10;
  limit = Math.max(+limit || 10, 1);
  limit = Math.min(limit, 100);

  let skip = cursor?.skip || ext?.skip || 0;
  skip = Math.max(+skip || 0, 0);

  const sortBy = cursor?.sortBy || ext?.sortBy || 'createdAt';
  const sortOrder = +cursor?.sortOrder || +ext?.sortOrder || SortOrder.DESC;
  const options = { limit, skip, sort: { [sortBy]: sortOrder } };
  return options;
}

export function createCursorMeta(total: number, options?: Partial<ApiCursorQuery>) {
  return {
    total,
    limit: options?.limit,
    skip: options?.skip,
  };
}

export class ApiCursorQuery {
  @ApiProperty({ required: false, example: 10, default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transformer(() => Number)
  limit: number;

  @ApiProperty({ required: false, example: 0, default: 0 })
  @IsOptional()
  @Transformer(() => Number)
  @IsInt()
  @Min(0)
  skip: number;

  @ApiProperty({ required: false, example: '_id' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false, enum: SortOrder, example: -1, default: -1 })
  @IsOptional()
  @Transformer(() => Number)
  @IsInt()
  sortOrder?: SortOrder;
}

export const ApiCursorResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        title: `CursorResponseOf${model.name}`,
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
          {
            properties: {
              meta: {
                type: 'object',
                properties: {
                  total: { type: 'number' },
                  limit: { type: 'number', example: 10 },
                  skip: { type: 'number', example: 0 },
                },
              },
            },
          },
        ],
      },
    }),
  );
};

export const MakeApi200Response = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(ApiOkResponse({ type: model }));
};

export const MakeApi400Response = (message: string) => {
  return applyDecorators(
    ApiBadRequestResponse({
      schema: {
        title: 'BadRequestResponse',
        properties: {
          message: { type: 'string', example: message },
          error: { type: 'string', example: 'Bad Request' },
          statusCode: { type: 'number', example: 400 },
        },
      },
    }),
  );
};
