import { Delay } from "./delay";

export class User {
  id: string | undefined;
  username: string | undefined;
  language: string | undefined;
  isAdmin: boolean | undefined;
  isSocialLogin: boolean | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
  birthday: Date | undefined;
  city: string | undefined;
  country: string | undefined;
  avatar: string | undefined;
  base64Image: string | undefined;
  delays: Delay [] = [];
}
