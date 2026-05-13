import { BaseResource, BaseResponse } from './base-response';
import { BaseEntity } from './base-entity';

export abstract class BaseAssembler<
  TEntity extends BaseEntity,
  TResource extends BaseResource,
  TResponse extends BaseResponse
> {
  abstract toEntityFromResource(resource: TResource): TEntity;
  abstract toResourceFromEntity(entity: TEntity): TResource;
  abstract toEntitiesFromResponse(response: TResponse): TEntity[];
}
