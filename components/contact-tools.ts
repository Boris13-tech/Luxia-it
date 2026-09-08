'use client';
import {useI18n} from '@/components/i18n-provider';
import { useEffect } from 'react';
import { flushSync } from 'react-dom';
type Registry = {
  registerTool: (
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: object;
      annotations: object;
      execute: (input: unknown) => unknown;
    },
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
export function useContactTools(
  stage: (category: string, message: string) => void,
) {
  const {t:tr} = useI18n();
  useEffect(() => {
    const registry = (document as Document & { modelContext?: Registry })
      .modelContext;
    if (!registry?.registerTool) return;
    const lifecycle = new AbortController();
    const choices = [
      tr('m324'),
      tr('m325'),
      tr('cloud'),
      tr('automation'),
      tr('m326'),
      tr('m327'),
    ];
    try {
      Promise.resolve(
        registry.registerTool(
          {
            name: 'stage_luxia_project',
            title: tr('m358'),
            description:
              tr('m359'),
            inputSchema: {
              type: 'object',
              properties: {
                category: { type: 'string', enum: choices },
                message: { type: 'string', minLength: 20, maxLength: 3000 },
              },
              required: ['category', 'message'],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: false },
            execute(input) {
              const x = input as { category?: unknown; message?: unknown };
              if (
                !x ||
                typeof x !== 'object' ||
                Object.keys(x).some(
                  (k) => !['category', 'message'].includes(k),
                ) ||
                typeof x.category !== 'string' ||
                !choices.includes(x.category) ||
                typeof x.message !== 'string' ||
                x.message.trim().length < 20 ||
                x.message.length > 3000
              )
                throw new Error(tr('m360'));
              flushSync(() => stage(x.category as string, x.message as string));
              return { status: 'staged', step: 1, sent: false };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, [stage,tr]);
}
