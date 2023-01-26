import { useEffect, useState } from "react";
import { NrqlQuery, NerdGraphQuery, usePlatformState } from "nr1";
import { DEV, STAGING, CROSS_ACCOUNT_CHUNK_SIZE } from "../common/constants";
import { FAILED_CHECKS } from "./nrqlQueries";
import { FETCH_AUTHORIZED_ACCOUNTS } from "./ngQueries";

const getMonitors = (query, isRaw = false, accountId) => {
  return NrqlQuery.query({
    query: query,
    accountIds: [accountId],
    ...(isRaw && { formatType: NrqlQuery.FORMAT_TYPE.RAW }), // for failed checks
  }).then((response) => {
    if (!isRaw) {
      let results = response.data;
      let monitors = results.map((result) => ({
        monitorName: result.metadata.groups[1].value,
        monitorId: result.metadata.groups[2].value,
        accountName: result.metadata.groups[3].value,
        accountId: result.metadata.groups[4].value,
        ...(result.data[0]["Total Checks"] && {
          totalChecks: result.data[0]["Total Checks"],
        }),
        ...(result.data[0]["syntheticsLocationLabel"] && {
          numLocations: result.data[0]["syntheticsLocationLabel"],
        }),
      }));
      monitors.pop();
      return monitors;
    } else {
      let results = response.data.facets;
      let monitors = results.map((result) => ({
        monitorName: result.name[0],
        monitorId: result.name[1],
        accountName: result.name[2],
        accountId: result.name[3],
        failedRate: Math.round(result.results[0].result * 100) / 100,
        failCount: result.results[1].sum,
        totalChecks: result.results[2].result,
      }));
      monitors.pop();
      return monitors;
    }
  });
};

export const useGuids = (query) => {
  const [{ accountId }] = usePlatformState();
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(async () => {
    setLoading(true);
    const mons = await getMonitors(query, query == FAILED_CHECKS, accountId);
    const monsById = mons.reduce((m, monitor) => {
      m[monitor.monitorId] = monitor;
      return m;
    }, {});

    const joinedIds = mons.map((monitor) => monitor.monitorId).join("', '");
    const uniqueAccounts = [
      ...new Set(mons.map((monitor) => monitor.accountId)),
    ];

    const fetchGuids = async () => {
      const promises = [];
      let response = [];
      for (
        let i = 0;
        i < uniqueAccounts.length;
        i += CROSS_ACCOUNT_CHUNK_SIZE
      ) {
        const chunkIds = uniqueAccounts.slice(i, i + CROSS_ACCOUNT_CHUNK_SIZE);
        const getAuthorizedAccounts = async () => {
          return NerdGraphQuery.query({
            query: FETCH_AUTHORIZED_ACCOUNTS,
          });
        };
        const accounts = await getAuthorizedAccounts();
        const authorizedAccounts = accounts.data.actor.accounts.map(
          (account) => `${account.id}`
        );
        let authorizedChunkIds = chunkIds.filter((x) =>
          authorizedAccounts.includes(x)
        );
        promises.push(
          NrqlQuery.query({
            query: `SELECT uniques(entityGuid) FROM SyntheticCheck where monitorId in
              ('${joinedIds}') facet monitorId SINCE 24 hours ago limit max`,
            accountIds: authorizedChunkIds,
            formatType: NrqlQuery.FORMAT_TYPE.RAW,
          })
        );
        response = await Promise.all(promises);
      }
      return response;
    };

    const results = await fetchGuids();
    if (results.length == 0) {
      setMonitors([]);
      setLoading(false);
      return;
    }
    const facets = results.length > 0 ? results[0].data?.facets : null;
    const guids = [].concat(...facets);

    for (const guid of guids) {
      const monitor = monsById[guid.name];
      monitor.guid = guid.results[0].members[0];
      if (DEV) {
        monitor.permalink = `https://dev-one.newrelic.com/redirect/entity/${monitor.guid}`;
      } else if (STAGING) {
        monitor.permalink = `https://staging-one.newrelic.com/redirect/entity/${monitor.guid}`;
      } else {
        monitor.permalink = `https://one.newrelic.com/redirect/entity/${monitor.guid}`;
      }
    }
    setMonitors(mons);
    setLoading(false);
  }, [query, accountId]);
  return {
    monitors,
    loading,
  };
};
