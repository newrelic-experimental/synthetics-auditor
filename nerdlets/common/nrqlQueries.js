// overview tab queries
export const TOTAL_CHECKS = `SELECT (sum(syntheticsFailedCheckCount) + sum(syntheticsSuccessCheckCount)) AS 'Billable Checks' FROM NrDailyUsage WHERE syntheticsTypeLabel != 'Ping' SINCE 1 month ago COMPARE WITH 1 week ago`;
export const FREE_PINGS = `SELECT (sum(syntheticsFailedCheckCount) + sum(syntheticsSuccessCheckCount)) AS 'Free Ping Checks' FROM NrDailyUsage WHERE syntheticsTypeLabel = 'Ping' SINCE 1 month ago COMPARE WITH 1 week ago`;
export const TIMESERIES_COMPARISON = `SELECT filter((sum(syntheticsFailedCheckCount) + sum(syntheticsSuccessCheckCount)), WHERE syntheticsTypeLabel != 'Ping') AS 'Billable Checks', filter((sum(syntheticsFailedCheckCount) + sum(syntheticsSuccessCheckCount)), WHERE syntheticsTypeLabel = 'Ping') AS 'Free Checks' FROM NrDailyUsage  SINCE 1 month ago TIMESERIES 1 day`;
export const SIX_MONTH_TREND = `SELECT filter((sum(syntheticsFailedCheckCount) + sum(syntheticsSuccessCheckCount)), where syntheticsTypeLabel != 'Ping') AS 'Billable Checks', filter((sum(syntheticsFailedCheckCount) + sum(syntheticsSuccessCheckCount)), where syntheticsTypeLabel = 'Ping') AS 'Free Ping Checks' FROM NrDailyUsage SINCE 6 months ago FACET monthOf(timestamp)`;
export const CHECKS_BY_ACCT = `SELECT (sum(syntheticsFailedCheckCount) + sum(syntheticsSuccessCheckCount)) AS 'Total Checks' FROM NrDailyUsage WHERE syntheticsTypeLabel != 'Ping' SINCE 1 month ago FACET consumingAccountName limit max`;
export const CHECKS_BY_TYPE = `SELECT (sum(syntheticsFailedCheckCount) + sum(syntheticsSuccessCheckCount)) AS 'Total Checks' FROM NrDailyUsage WHERE syntheticsTypeLabel != 'Ping' SINCE 1 month ago FACET syntheticsTypeLabel`;

// high checks tab
export const HIGH_CHECKS = `SELECT (sum(syntheticsFailedCheckCount) + sum(syntheticsSuccessCheckCount)) AS 'Total Checks' FROM NrDailyUsage where syntheticsTypeLabel != 'Ping' SINCE 1 month ago facet syntheticsMonitorName, syntheticsMonitorId, consumingAccountName, consumingAccountId limit 50`;
export const HIGH_LOCATIONS = `SELECT uniqueCount(syntheticsLocationLabel) FROM NrDailyUsage WHERE syntheticsTypeLabel != 'Ping' SINCE 1 day ago FACET syntheticsMonitorName, syntheticsMonitorId, consumingAccountName, consumingAccountId LIMIT 50`;

// failed checks tab - fails at 100; limiting to 50
export const FAILED_CHECKS = `SELECT sum(syntheticsFailedCheckCount)/ (sum(syntheticsFailedCheckCount) + sum(syntheticsSuccessCheckCount)) * 100 AS 'Failure Rate', sum(syntheticsFailedCheckCount) AS 'Number Failed Checks', (sum(syntheticsFailedCheckCount) + sum(syntheticsSuccessCheckCount)) AS 'Total Number of Checks' FROM NrDailyUsage where syntheticsTypeLabel != 'Ping' SINCE 1 month ago facet syntheticsMonitorName, syntheticsMonitorId, consumingAccountName, consumingAccountId limit 50`;

// low checks
export const LOW_CHECKS = `FROM NrDailyUsage SELECT (sum(syntheticsFailedCheckCount) + sum(syntheticsSuccessCheckCount)) * -1 as 'Total Checks' WHERE syntheticsTypeLabel != 'Ping' since 1 month ago FACET syntheticsMonitorName, syntheticsMonitorId, consumingAccountName, consumingAccountId limit 50`;
export const LOW_LOCATIONS = `SELECT uniqueCount(syntheticsLocationLabel) * -1 FROM NrDailyUsage WHERE syntheticsTypeLabel != 'Ping' SINCE 1 day ago FACET syntheticsMonitorName, syntheticsMonitorId, consumingAccountName, consumingAccountId LIMIT 50`;

// audit tab
export const CHANGED_MONITORS = `SELECT description, actionIdentifier, actorEmail, actorAPIKey, targetId as 'Monitor ID' FROM NrAuditEvent WHERE targetType = 'MONITOR'  and actionIdentifier IN ('synthetics_monitor.update', 'synthetics_monitor.create', 'synthetics_monitor.delete') SINCE 1 month ago LIMIT max`;
export const MONTH_CHANGES_OVERVIEW = `SELECT count(*) FROM NrAuditEvent WHERE actionIdentifier IN ('synthetics_monitor.update', 'synthetics_monitor.create', 'synthetics_monitor.delete') FACET actionIdentifier SINCE 1 month ago timeseries`;
export const TOP_MONTHLY_MODIFIERS = `SELECT count(*) FROM NrAuditEvent WHERE actionIdentifier IN ('synthetics_monitor.update', 'synthetics_monitor.create', 'synthetics_monitor.delete') SINCE 1 month ago facet actorEmail, actionIdentifier LIMIT max`;
export const DOWNTIME_DATA = `SELECT * FROM NrAuditEvent WHERE actionIdentifier IN ('synthetics_monitor_downtime.create', 'synthetics_monitor_downtime.update', 'synthetics_monitor_downtime.delete') since one month ago limit max`;
