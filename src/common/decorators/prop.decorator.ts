export function Prop(options?: { required?: boolean, type?: any, enum?: any, default?: any, select?: boolean, example?: any, ref?: string, foreignField?: string }) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata('prop', options || {}, target, propertyKey);
  };
}