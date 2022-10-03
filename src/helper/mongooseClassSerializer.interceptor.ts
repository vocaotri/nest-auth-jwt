import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { Document } from 'mongoose';
import { decryptData } from './hash';

function MongooseClassSerializerInterceptor(
  classToIntercept: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
      if (!(document instanceof Document)) {
        return document;
      }
      return plainToClass(classToIntercept, document.toJSON());
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[] | any,
    ) {
      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
      }
      return this.changePlainObjectToClass(response);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[] | any,
      options: ClassTransformOptions,
    ) {
      let data: any;
      let serializeData: any;
      if (response.data?.docs && response.data?.totalDocs) { //for pagination
        let serializeDatas = [];
        response.data?.docs.forEach(data => {
          serializeDatas.push(super.serialize(this.prepareResponse(data), options));
        });
        serializeDatas = { ...response.data, docs: serializeDatas };
        data = serializeDatas;
      } else { //for single object
        serializeData = super.serialize(this.prepareResponse(response.data ?? response), options);
        data = serializeData;
        if (data.password_show && response.data?.role) {
          try {
            data.password_show = decryptData(response.data.password_show);
          } catch (err) {
            data.password_show = response.data.password_show;
          }
        }
      }
      if (response.exception) {
        response.exception.forEach(exceptionItem => {
          data[exceptionItem.name] = exceptionItem.value;
        });
      }
      delete response.exception;
      return data;
      return { ...response, data: data };
    }
  };
}

export default MongooseClassSerializerInterceptor;