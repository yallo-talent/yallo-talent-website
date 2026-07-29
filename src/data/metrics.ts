export interface MetricStat {
  target: number;
  suffix?: string;
  label: string;
}

export const homeMetrics: MetricStat[] = [
  { target: 72, suffix: "hrs", label: "Brief to shortlist" },
  { target: 2, suffix: ":1", label: "CV-to-interview ratio" },
  { target: 3, label: "Delivery regions" },
  { target: 6, suffix: "+", label: "Platform ecosystems" },
];
