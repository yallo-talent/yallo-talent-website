interface BenchSignalProps {
  note: string;
}

export function BenchSignal({ note }: BenchSignalProps) {
  return <span className="bench-signal">{note}</span>;
}
