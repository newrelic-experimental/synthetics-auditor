import React, { useEffect, useState } from "react";
import {
  BlockText,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Grid,
  GridItem,
  HeadingText,
  NerdGraphQuery,
  usePlatformState,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableRowCell,
} from "nr1";
import { LOW_CHECKS, LOW_LOCATIONS } from "../common/nrqlQueries";
import { generateMonitorByReportingPeriodQuery } from "../common/ngQueries";
import { useGuids } from "../common/utils";

const LowestMonitors = () => {
  const { monitors, loading } = useGuids(LOW_CHECKS);

  const renderTable = () => {
    return (
      <>
        {/* Loading State */}
        {loading && <Spinner type={Spinner.TYPE.DOT} />}
        {/* Empty */}
        {!loading && monitors && monitors.length === 0 && (
          <EmptyState
            iconType={
              EmptyState.ICON_TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__ALL_ENTITIES
            }
            title="You don't have any monitors"
            description="Come back when you have created Synthetics Monitors"
          />
        )}
        {/* Monitors Loaded */}
        {!loading && monitors && monitors.length > 0 && (
          <Table items={monitors} style={{ height: "500px" }}>
            <TableHeader>
              <TableHeaderCell
                value={({ item }) => item.monitorName}
                width="50%"
              >
                Monitor Name
              </TableHeaderCell>
              <TableHeaderCell value={({ item }) => item.accountId} width="30%">
                Consuming Account Name
              </TableHeaderCell>
              <TableHeaderCell
                value={({ item }) => item.totalChecks}
                width="20%"
              >
                Total Monthly Checks
              </TableHeaderCell>
            </TableHeader>

            {({ item }) => (
              <TableRow>
                <TableRowCell>
                  <a href={item.permalink} target="_blank">
                    <span style={{ color: "black" }}>{item.monitorName}</span>
                  </a>
                </TableRowCell>
                <TableRowCell>{item.accountName}</TableRowCell>
                <TableRowCell>
                  {item.totalChecks.toLocaleString().substring(1)}
                </TableRowCell>
              </TableRow>
            )}
          </Table>
        )}
      </>
    );
  };

  return <>{renderTable()}</>;
};

const ChecksByMonitorPeriod = () => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState([true]);
  const [{ accountId }] = usePlatformState();

  const [period, setPeriod] = useState("1440");

  const fetchMonitorsByPeriod = () => {
    if (period) {
      NerdGraphQuery.query({
        query: generateMonitorByReportingPeriodQuery(accountId),
        variables: { period: period },
      })
        .then((response) => {
          const filteredMonitors = [];
          const unfilteredMonitors =
            response.data.actor.entitySearch.results.entities;

          unfilteredMonitors.forEach((unfilteredMonitor) => {
            if (
              unfilteredMonitor.tags.find((element) => element == "Ping") ==
              undefined
            ) {
              filteredMonitors.push(unfilteredMonitor);
            }
          });
          return filteredMonitors;
        })
        .then((data) => {
          setMonitors(data);
        });
    }
  };

  useEffect(() => {
    fetchMonitorsByPeriod();
    setLoading(false);
  }, [period]);

  const renderTable = () => {
    return (
      <>
        {/* Loading State */}
        {loading && <Spinner type={Spinner.TYPE.DOT} />}

        {/* Empty */}
        {!loading && monitors && monitors.length === 0 && (
          <EmptyState
            iconType={
              EmptyState.ICON_TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__ALL_ENTITIES
            }
            title="You don't have any monitors matching this frequency."
            description="You don't have any monitors matching this frequency. Try a different dropdown selection for more results."
          />
        )}

        {/* Monitors Loaded */}
        {!loading && monitors && monitors.length > 0 && (
          <Table items={monitors} style={{ height: "500px" }}>
            <TableHeader>
              <TableHeaderCell value={({ item }) => item.name} width="70%">
                Monitor Name
              </TableHeaderCell>
              <TableHeaderCell value={({ item }) => item.account.name}>
                Account Name
              </TableHeaderCell>
            </TableHeader>

            {({ item }) => (
              <TableRow>
                <TableRowCell>
                  <a href={item.permalink} target="_blank">
                    <span style={{ color: "black" }}>{item.name}</span>
                  </a>
                </TableRowCell>
                <TableRowCell>{item.account.name}</TableRowCell>
              </TableRow>
            )}
          </Table>
        )}
      </>
    );
  };

  return (
    <>
      <Select
        label="Frequency selections"
        labelInline
        onChange={(_, value) => {
          setPeriod(value);
          setLoading(true);
        }}
        value={period}
      >
        <SelectItem value="1440">1 day</SelectItem>
        <SelectItem value="720">12 hours</SelectItem>
        <SelectItem value="360">6 hours</SelectItem>
        <SelectItem value="60">1 hour</SelectItem>
        <SelectItem value="30">30 minutes</SelectItem>
        <SelectItem value="15">15 minutes</SelectItem>
        <SelectItem value="10">10 minutes</SelectItem>
        <SelectItem value="5">5 minutes</SelectItem>
        <SelectItem value="1">1 minute</SelectItem>
      </Select>

      {renderTable()}
    </>
  );
};

const LeastLocations = () => {
  const { monitors, loading } = useGuids(LOW_LOCATIONS);

  const renderTable = () => {
    return (
      <>
        {/* Loading State */}
        {loading && <Spinner type={Spinner.TYPE.DOT} />}

        {/* Empty */}
        {!loading && monitors && monitors.length === 0 && (
          <EmptyState
            iconType={
              EmptyState.ICON_TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__ALL_ENTITIES
            }
            title="You don't have any monitors"
            description="Come back when you have created Synthetics Monitors"
          />
        )}

        {/* Monitors Loaded */}
        {!loading && monitors && monitors.length > 0 && (
          <Table items={monitors} style={{ height: "500px" }}>
            <TableHeader>
              <TableHeaderCell
                value={({ item }) => item.monitorName}
                width="50%"
              >
                Monitor Name
              </TableHeaderCell>
              <TableHeaderCell value={({ item }) => item.accountId} width="30%">
                Consuming Account Name
              </TableHeaderCell>
              <TableHeaderCell
                value={({ item }) => item.numLocations}
                width="20%"
              >
                Location Count
              </TableHeaderCell>
            </TableHeader>

            {({ item }) => (
              <TableRow>
                <TableRowCell>
                  <a href={item.permalink} target="_blank">
                    <span style={{ color: "black" }}>{item.monitorName}</span>
                  </a>
                </TableRowCell>
                <TableRowCell>{item.accountName}</TableRowCell>
                <TableRowCell>
                  {item.numLocations.toLocaleString().substring(1)}
                </TableRowCell>
              </TableRow>
            )}
          </Table>
        )}
      </>
    );
  };
  return <>{renderTable()}</>;
};

export function LowestChecks() {
  return (
    <>
      <Grid>
        {/* row 1; 2 items */}
        <GridItem columnSpan={3}>
          <Card
            spacingType={[Card.SPACING_TYPE.LARGE]}
            style={{ backgroundColor: "#F6FAFD" }}
          >
            <CardHeader>
              <HeadingText>
                Your Monitors that produce the least synthetics checks
              </HeadingText>
            </CardHeader>
            <CardBody>
              <HeadingText type={HeadingText.TYPE.HEADING_6}>
                Best Practices:
              </HeadingText>
              <BlockText>
                <ol>
                  <li>
                    Evaluate if the frequency of the monitor is not often
                    enough. Critical entities may need frequent checks, but less
                    critical entities may be fine with less frequent checks.
                  </li>
                  <li>
                    Evaluate if there are enough locations. Three locations is
                    recommended as rule of thumb. Having one location on a
                    monitor increases likelihood of erroneous alerts.
                  </li>
                </ol>
              </BlockText>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem columnSpan={9}>
          <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
            <CardHeader>
              <HeadingText>
                Monitors Making the Least Non-Ping Checks
              </HeadingText>
              <BlockText>since 1 month ago - Top 50</BlockText>
            </CardHeader>
            <CardBody>
              <LowestMonitors />
            </CardBody>
          </Card>
        </GridItem>
        {/* row 2; 2 items */}
        <GridItem columnSpan={6}>
          <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
            <CardHeader>
              <HeadingText>Monitors with Least Locations</HeadingText>
              <BlockText>as of 1 hour ago - Top 50</BlockText>
            </CardHeader>
            <CardBody>
              <LeastLocations />
            </CardBody>
          </Card>
        </GridItem>
        {/* row 3; 1 item */}
        <GridItem columnSpan={6}>
          <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
            <CardHeader>
              <HeadingText>Monitors by Frequency</HeadingText>
            </CardHeader>
            <CardBody>
              <ChecksByMonitorPeriod />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
}
