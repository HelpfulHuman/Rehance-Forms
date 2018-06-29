export type Diff<
  T extends string | number | symbol,
  U extends string | number | symbol
  > = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];

export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

export type FieldMap = {
  [field: string]: any;
};

export type StringMap = {
  [field: string]: string;
};

export type BoolMap = {
  [field: string]: boolean;
};