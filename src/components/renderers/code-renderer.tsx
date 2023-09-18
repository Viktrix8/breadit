"use client";

export function CodeRenderer({ data }: any) {
  data;

  return (
    <pre className="bg-gray-700 rounded p-3">
      <code className="text-white">{data.code}</code>
    </pre>
  );
}
