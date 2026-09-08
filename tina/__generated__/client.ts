import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '72bebcdc29641394171b225f1de0c76d8614a04c', queries,  });
export default client;
  