/**
 * A type for partially mocked classes.
 */
export type PartialMock<T> = {
  [P in keyof T]?: T[P] & jest.Mock;
};
