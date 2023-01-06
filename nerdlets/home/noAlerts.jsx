import React, { useEffect, useState } from "react";
import {
  BillboardChart,
  BlockText,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  EmptyState,
  Grid,
  GridItem,
  HeadingText,
  Link,
  usePlatformState,
  NerdGraphQuery,
  NrqlQuery,
  Spinner,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableRowCell,
} from "nr1";
import {
  generateNoAlertsQuery,
  FETCH_MONITOR_INFO_NO_ALERTS,
} from "../common/ngQueries";
import { CHUNK_SIZE, ENTITY_MAX } from "../common/constants";

const NoAlerts = () => {
  const [{ accountId }] = usePlatformState();
  const [types, setTypes] = useState([
    "Simple Browser",
    "Scripted API",
    "Scripted Browser",
    "Step Monitor",
    "Certificate Check",
    "Broken Links",
  ]);
  const [monitors, setMonitors] = useState([]);
  const [totals, setTotals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    setLoading(true);
    const { monitors, aggCount } = await getCount(accountId);
    setMonitors(monitors);
    setTotals(aggCount);
    setLoading(false);
  }, [accountId, types]);

  const getGuids = async (accountId) => {
    const results = await fetchGuids(accountId);
    return results;
  };

  const fetchGuids = async (accountId, cursor = null, entityArr = []) => {
    const response = await NerdGraphQuery.query({
      query: generateNoAlertsQuery(accountId, cursor),
    });

    if (
      response.error != null ||
      !response.data.actor.entitySearch ||
      !response.data.actor.entitySearch.results
    ) {
      return entityArr;
    }

    const { entities, nextCursor } = response.data.actor.entitySearch.results;

    const matchTypes = (entity) => {
      let isMatched = false;
      entity.tags.forEach((tag) => {
        if (tag.key === "monitorType") {
          isMatched = types.includes(tag.values[0]);
        }
      });
      return isMatched;
    };
    const filtered = await entities
      .filter(
        (entity) =>
          entity.__typename == "SyntheticMonitorEntityOutline" &&
          entity.tags.some(
            (tag) =>
              tag.key === "publicLocation" || tag.key === "privateLocation"
          ) &&
          matchTypes(entity)
      )
      .map((entity) => entity.guid);
    entityArr = entityArr.concat(filtered);

    if (entityArr.length >= ENTITY_MAX || nextCursor == "null") {
      return entityArr;
    } else {
      return fetchGuids(accountId, `"${nextCursor}"`, entityArr);
    }
  };

  const getMons = async (accountId) => {
    const guids = await getGuids(accountId);
    const results = [];

    for (let i = 0; i < guids.length; i += CHUNK_SIZE) {
      if (guids.length != 0) {
        const chunk = guids.slice(i, i + CHUNK_SIZE);
        const response = await NerdGraphQuery.query({
          query: FETCH_MONITOR_INFO_NO_ALERTS,
          variables: { guids: chunk },
        });
        results.push(...response.data.actor.entities);
      }
    }
    return results;
  };

  const getCount = async (accountId) => {
    const monitors = await getMons(accountId); //merge chunked arrays

    //relate mon id to the mon it came from
    const monsById = monitors.reduce((m, monitor) => {
      m[monitor.monitorId] = monitor;
      return m;
    }, {});

    const joinedIds = monitors
      .map((monitor) => monitor.monitorId)
      .join("' , '");

    const response = await NrqlQuery.query({
      query: `SELECT (sum(syntheticsFailedCheckCount) + sum(syntheticsSuccessCheckCount)) AS 'total_checks' FROM NrDailyUsage
            WHERE productLine = 'Synthetics' and syntheticsMonitorId in ('${joinedIds}')
            since 2 months ago facet syntheticsMonitorId limit max`,
      accountIds: [accountId],
      formatType: NrqlQuery.FORMAT_TYPE.RAW,
    });

    let aggCount = 0;
    for (const facet of response.data.facets) {
      const monitor = monsById[facet.name];
      const totalChecks = facet.results[0].result;
      monitor.totalChecks = totalChecks;
      aggCount += totalChecks;
    }
    monitors.sort((a, b) => {
      return b.totalChecks - a.totalChecks;
    });
    return { aggCount, monitors };
  };

  const renderCheckBox = () => {
    return (
      <>
        <CheckboxGroup
          onChange={(_, values) => {
            setTypes(values);
          }}
          value={types}
        >
          <Checkbox
            label="Ping/Simple"
            value="Ping"
            info="Ping checks are free and don't contribute to your monitor total usage count for billing"
          />
          <Checkbox label="Simple Browser" value="Simple Browser" />
          <Checkbox label="Scripted API" value="Scripted API" />
          <Checkbox label="Scripted Browser" value="Scripted Browser" />
          <Checkbox label="Step Monitor" value="Step Monitor" />
          <Checkbox label="Certificate Check" value="Certificate Check" />
          <Checkbox label="Broken Links" value="Broken Links" />
        </CheckboxGroup>
      </>
    );
  };

  const renderTable = () => {
    return (
      <>
        {/* Loading State */}
        {loading && <Spinner type={Spinner.TYPE.DOT} />}

        {/* Empty */}
        {!loading && monitors.length == 0 && (
          <EmptyState
            iconType={
              EmptyState.ICON_TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__ALL_ENTITIES
            }
            title="You don't have any monitors without alerts configured"
            description="Great work!"
          />
        )}

        {/* Monitors Loaded */}
        {!loading && monitors.length > 0 && (
          <Table items={monitors} style={{ height: "500px" }}>
            <TableHeader>
              <TableHeaderCell value={({ item }) => item.name}>
                Monitor Name (Monitor Count: {monitors.length})
              </TableHeaderCell>
              <TableHeaderCell value={({ item }) => item.monitorType}>
                Monitor Type
              </TableHeaderCell>
              <TableHeaderCell value={({ item }) => item.account.name}>
                Consuming Account
              </TableHeaderCell>
              <TableHeaderCell value={({ item }) => item.totalChecks}>
                Monthly Checks
              </TableHeaderCell>
            </TableHeader>

            {({ item }) => (
              <TableRow>
                <TableRowCell>
                  <a href={item.permalink} target="_blank">
                    <span style={{ color: "black" }}>{item.name}</span>
                  </a>
                </TableRowCell>
                <TableRowCell>
                  {item.monitorType.toLowerCase().split("_").join(" ")}
                </TableRowCell>
                <TableRowCell>{item.account.name}</TableRowCell>
                <TableRowCell>
                  {item.totalChecks?.toLocaleString() || item.totalChecks}
                </TableRowCell>
              </TableRow>
            )}
          </Table>
        )}
      </>
    );
  };

  const renderBillboard = () => {
    if (loading) {
      return <Spinner type={Spinner.TYPE.DOT} />;
    }

    if (totals === 0) {
      return (
        <EmptyState
          iconType={
            EmptyState.ICON_TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__ALL_ENTITIES
          }
          title="You don't have any monitors without alerts"
          description="That's great. Keep up the good work!"
        />
      );
    } else {
      return (
        <BillboardChart
          fullheight
          fullwidth
          data={[
            {
              metadata: {
                id: "total-checks-no-alerts",
                name: "checks last month",
                viz: "main",
                units_data: {
                  y: "number",
                },
              },
              data: [{ y: totals }],
            },
          ]}
        />
      );
    }
  };

  return (
    <>
      <Grid>
        {/* row 1, 3 items  */}
        <GridItem columnSpan={4}>
          <Card
            spacingType={[Card.SPACING_TYPE.LARGE]}
            style={{
              backgroundColor: "#F6FAFD",
            }}
          >
            <CardHeader>
              <HeadingText>
                Your Monitors that don't have an associated Alert
              </HeadingText>
            </CardHeader>
            <CardBody>
              <BlockText>
                It's recommended to have an alert associated to every synthetics
                monitor to stay aware of its results. The monitors listed here
                are monitors that are currently running. You can uncheck Ping to
                see all monitors without alerts that are contributing to your
                synthetics cap.
                <br />
                <br />
                <span style={{ fontWeight: "bold" }}>Note:</span> The max
                calculated is 1000 for this page. The parent account does not
                return child account data on this dashboard.
              </BlockText>
              <br />
              <br />
              <HeadingText type={HeadingText.TYPE.HEADING_6}>
                Best Practices
              </HeadingText>
              <BlockText>
                <ol>
                  <li>
                    Configure an alert to this monitor.{" "}
                    <Link to="https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/using-monitors/alerts-synthetic-monitoring/">
                      See our docs
                    </Link>
                    <br />
                    <br />
                  </li>
                  <li>
                    Evaluate if the monitor is still needed.
                    <br />
                    <ul>
                      <li>
                        Permanently delete monitors:{" "}
                        <Link to="https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/using-monitors/add-edit-monitors/#deleting-monitors">
                          See our docs
                        </Link>
                      </li>
                      <li>
                        Disable monitors:{" "}
                        <Link to="https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/using-monitors/add-edit-monitors/#editing-monitors">
                          See our docs
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ol>
              </BlockText>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem columnSpan={2}>
          <Card>
            <CardHeader>
              <HeadingText>Facet by Monitor Type</HeadingText>
            </CardHeader>
            <CardBody>
              <>{renderCheckBox()}</>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem columnSpan={6}>
          <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
            <CardHeader>
              <HeadingText>Checks Without Alerts by Type Selected</HeadingText>
            </CardHeader>
            <CardBody>
              <>{renderBillboard()}</>
            </CardBody>
          </Card>
        </GridItem>
        {/* row 2, 1 item */}
        <GridItem columnSpan={12}>
          <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
            <CardHeader>
              <HeadingText>Monitors without alerts</HeadingText>
            </CardHeader>
            <CardBody>
              <>{renderTable()}</>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
};

export default NoAlerts;
