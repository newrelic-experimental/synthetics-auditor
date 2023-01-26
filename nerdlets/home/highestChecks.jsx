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
import { HIGH_CHECKS, HIGH_LOCATIONS } from "../common/nrqlQueries";
import { generateMonitorByReportingPeriodQuery } from "../common/ngQueries";
import { useGuids } from "../common/utils";

const HighestMonitors = () => {
  const { monitors, loading } = useGuids(HIGH_CHECKS);

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
                <TableRowCell>{item.totalChecks.toLocaleString()}</TableRowCell>
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
  const [{ accountId }] = usePlatformState();
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("1");

  useEffect(async () => {
    setLoading(true);
    fetchMonitorsByPeriod();
    setLoading(false)
  }, [period, accountId]);

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
          setLoading(false);
        });
    }
  };

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
            title="No monitors match"
            description="Select a different frequency"
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
        }}
        value={period}
      >
        <SelectItem value="1">1 minute</SelectItem>
        <SelectItem value="5">5 minutes</SelectItem>
        <SelectItem value="10">10 minutes</SelectItem>
        <SelectItem value="15">15 minutes</SelectItem>
        <SelectItem value="30">30 minutes</SelectItem>
        <SelectItem value="60">1 hour</SelectItem>
        <SelectItem value="360">6 hours</SelectItem>
        <SelectItem value="720">12 hours</SelectItem>
        <SelectItem value="1440">1 day</SelectItem>
      </Select>

      {renderTable()}
    </>
  );
};

const MostLocations = () => {
  const { monitors, loading } = useGuids(HIGH_LOCATIONS);

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
                width="70%"
              >
                Monitor Name
              </TableHeaderCell>
              <TableHeaderCell value={({ item }) => item.accountId} width="18%">
                Consuming Account Name
              </TableHeaderCell>
              <TableHeaderCell
                value={({ item }) => item.numLocations}
                width="12%"
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
                <TableRowCell>{item.numLocations}</TableRowCell>
              </TableRow>
            )}
          </Table>
        )}
      </>
    );
  };
  return <>{renderTable()}</>;
};

export function HighestChecks() {
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
                Your Monitors that produce the most synthetics checks
              </HeadingText>
            </CardHeader>
            <CardBody>
              <HeadingText type={HeadingText.TYPE.HEADING_6}>
                Best Practices:
              </HeadingText>
              <BlockText>
                <ol>
                  <li>
                    Evaluate if the frequency of the monitor is too often.
                    Critical entities may need frequent checks, but less
                    critical entities may be fine with less frequent checks.
                  </li>
                  <li>
                    Evaluate if the number of locations is warranted. Each
                    location selected will run at the frequency configured.
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
                Monitors Making the Most Non-Ping Checks
              </HeadingText>
              <BlockText>since 1 month ago - Top 50</BlockText>
            </CardHeader>
            <CardBody>
              <HighestMonitors />
            </CardBody>
          </Card>
        </GridItem>

        {/* row 2; 2 items */}
        <GridItem columnSpan={8}>
          <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
            <CardHeader>
              <HeadingText>Monitors with Most Locations</HeadingText>
              <BlockText>as of 1 hour ago - Top 50</BlockText>
            </CardHeader>
            <CardBody>
              <MostLocations />
            </CardBody>
          </Card>
        </GridItem>

        {/* row 3; 1 item */}
        <GridItem columnSpan={4}>
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
