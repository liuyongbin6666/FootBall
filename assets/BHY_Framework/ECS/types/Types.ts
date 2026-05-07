/**
 * 对象类型定义，用于指定类的构造函数类型
 */
export type ObjectType<T> = new (...args: any[]) => T; 