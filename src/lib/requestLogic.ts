// src/lib/requestLogic.ts
import { invoke } from '@tauri-apps/api/core';

interface PmContext {
  environment: {
    set: (key: string, value: string) => void;
    get: (key: string) => string | undefined;
  };
  request: {
    body: { raw: string };
  };
}

export async function executeRequest(
  method: string,
  rawUrl: string,
  headers: Record<string, string>,
  body: string,
  preRequestScript: string
) {
  const variables = new Map<string, string>();
  const setVar = (k: string, v: string) => variables.set(k, v);
  const getVar = (k: string) => variables.get(k);

  const pm: PmContext = {
    environment: { set: setVar, get: getVar },
    request: { body: { raw: body } }
  };

  if (preRequestScript.trim()) {
    try {
      const userFn = new Function('pm', preRequestScript);
      userFn(pm);
    } catch (err) {
      throw new Error(`Script Error: ${err}`);
    }
  }

  let finalUrl = rawUrl;
  let finalBody = body;

  variables.forEach((value, key) => {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    finalUrl = finalUrl.replace(regex, value);
    finalBody = finalBody.replace(regex, value);
  });

  const response = await invoke('make_request', {
    request: {
      method,
      url: finalUrl,
      headers,
      body: method !== 'GET' ? finalBody : null
    }
  });

  return response;
}