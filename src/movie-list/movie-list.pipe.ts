// import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

// @Injectable()
// export class MovieListPipe implements PipeTransform {
//   transform(value: any, metadata: ArgumentMetadata) {
//     return value;
//   }
// }

import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
