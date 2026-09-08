'use client';
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
  useEffect(() => {
    const registry = (document as Document & { modelContext?: Registry })
      .modelContext;
    if (!registry?.registerTool) return;
    const lifecycle = new AbortController();
    const choices = [
      'Intelligence artificielle',
      'Cybersécurité',
      'Cloud',
      'Automatisation',
      'Partenariat',
      'Autre',
    ];
    try {
      Promise.resolve(
        registry.registerTool(
          {
            name: 'stage_luxia_project',
            title: 'Préparer un projet Luxia-IT',
            description:
              'Renseigne la catégorie et le contexte dans le formulaire visible. Aucun message envoyé ; les coordonnées et la confirmation restent à compléter.',
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
                throw new Error('Catégorie ou contexte invalide.');
              flushSync(() => stage(x.category as string, x.message as string));
              return { status: 'staged', step: 1, sent: false };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, [stage]);
}
