type Keys = 'a' | 'b' | 'c'
type Users = Record<Keys, {name: string}>;

type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

type User = {
  name: string;
  age: number;
}

type R = MyPartial<User>