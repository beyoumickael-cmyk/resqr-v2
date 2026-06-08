export const operationalStatuses = ["black", "green", "amber", "red"] as const;

export type OperationalStatus = (typeof operationalStatuses)[number];

export type StatusCause = {
  readonly status: OperationalStatus;
  readonly label: string;
};

const statusRank: Record<OperationalStatus, number> = {
  black: 0,
  green: 1,
  amber: 2,
  red: 3,
};

export function getWorstStatus(causes: readonly StatusCause[]): OperationalStatus {
  if (causes.length === 0) {
    return "black";
  }

  return causes.reduce<OperationalStatus>((worst, cause) => {
    return statusRank[cause.status] > statusRank[worst] ? cause.status : worst;
  }, "black");
}
