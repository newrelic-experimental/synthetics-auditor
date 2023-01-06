import { ngql } from "nr1";

export const generateNoAlertsQuery = (accountId, cursor) => ngql`
{
  actor {
    entitySearch(queryBuilder: {alertSeverity: NOT_CONFIGURED, domain: SYNTH, tags: [{key: "monitorStatus", value: "enabled"}, {key: "accountId", value: "${accountId}"}], reporting: true}) {
      results(cursor: ${cursor}) {
        entities {
          guid
          tags {
            values
            key
          }
        }
        nextCursor
      }
    }
  }
}
`;

// to do: limit on entities is 25 per search, will need to work on this use case
export const FETCH_MONITOR_INFO_NO_ALERTS = ngql`
query ($guids: [EntityGuid]!) {
  actor {
    entities(guids: $guids) {
      ... on SyntheticMonitorEntity {
        monitorId
      }
      account {
        id
        name
      }
      permalink
      name
      guid
    }
  }
}
`;

export const generateMonitorByReportingPeriodQuery = (accountId) => ngql`
query ($period: String!) {
  actor {
    entitySearch(queryBuilder: {domain: SYNTH, reporting: true, type: MONITOR, tags: [{key: "period", value: $period}, {key: "accountId", value: "${accountId}"}]}) {
      results {
        entities {
          account {
            name
            id
          }
          name
          permalink
          guid
          tags {
            values
          }
        }
      }
    }
  }
}
`;
