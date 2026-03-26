"use client";

import { useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

import {
  POLL_INTERVAL_MS,
  SOCIAL_SYNC_EVENT,
  SocialTable,
  readDemoRows
} from "./social";

export function useLiveTable<T>({
  table,
  select,
  orderBy,
  limit
}: {
  table: SocialTable;
  select: string;
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
}) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"live" | "polling" | "demo">("demo");
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    let active = true;

    const loadRows = async () => {
      if (!client) {
        if (active) {
          setRows(readDemoRows<T>(table));
          setLoading(false);
          setMode("demo");
        }
        return;
      }

      try {
        let query = client.from(table).select(select);

        if (orderBy) {
          query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: nextError } = await query;
        if (!active) {
          return;
        }

        if (nextError) {
          setError(nextError.message);
          setMode("polling");
          return;
        }

        setRows((data ?? []) as T[]);
        setError(null);
        setLoading(false);
      } catch (caughtError) {
        if (!active) {
          return;
        }

        setError(caughtError instanceof Error ? caughtError.message : "Unable to load live data.");
        setMode("polling");
        setLoading(false);
      }
    };

    void loadRows();

    if (!client) {
      const handleDemoSync = (event: Event) => {
        const customEvent = event as CustomEvent<{ table?: SocialTable }>;
        if (!customEvent.detail?.table || customEvent.detail.table === table) {
          setRows(readDemoRows<T>(table));
        }
      };

      const handleStorage = (event: StorageEvent) => {
        if (!event.key || event.key.endsWith(table)) {
          setRows(readDemoRows<T>(table));
        }
      };

      window.addEventListener(SOCIAL_SYNC_EVENT, handleDemoSync as EventListener);
      window.addEventListener("storage", handleStorage);

      return () => {
        active = false;
        window.removeEventListener(SOCIAL_SYNC_EVENT, handleDemoSync as EventListener);
        window.removeEventListener("storage", handleStorage);
      };
    }

    const channel = client
      .channel(`lawson-${table}-feed`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table
        },
        () => {
          setMode("live");
          void loadRows();
        }
      )
      .subscribe((status) => {
        if (!active) {
          return;
        }

        if (status === "SUBSCRIBED") {
          setMode("live");
        }

        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setMode("polling");
        }
      });

    const pollId = window.setInterval(() => {
      void loadRows();
    }, POLL_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(pollId);
      void client.removeChannel(channel);
    };
  }, [limit, orderBy?.ascending, orderBy?.column, refreshNonce, select, table]);

  const refresh = () => {
    setRefreshNonce((value) => value + 1);
  };

  return {
    rows,
    loading,
    error,
    mode,
    refresh
  };
}
