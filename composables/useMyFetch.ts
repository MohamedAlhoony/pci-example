// /composables/useMyFetch.ts

import { UseFetchOptions, AsyncDataOptions } from "#app";
import { NitroFetchRequest } from "nitropack";
import { KeyOfRes } from "nuxt/dist/app/composables/asyncData";
import { baseURL } from "../helpers";

export function useMyFetch<T>(
  request: NitroFetchRequest,
  opts?:
    | UseFetchOptions<
        T extends void ? unknown : T,
        (res: T extends void ? unknown : T) => T extends void ? unknown : T,
        KeyOfRes<
          (res: T extends void ? unknown : T) => T extends void ? unknown : T
        >
      >
    | undefined
) {
  const config = useRuntimeConfig();
  const { userToken } = useAuth();
  return useFetch<T>(request, {
    baseURL: baseURL,
    ...opts,
    headers: {
      ...opts?.headers,
      Authorization: `${userToken.value}`,
    },
  });
}
