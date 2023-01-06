import React from "react";
import {
  BlockText,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Grid,
  GridItem,
  HeadingText,
  Icon,
  Spinner,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableRowCell,
  Tooltip,
} from "nr1";
import { FAILED_CHECKS } from "../common/nrqlQueries";
import { useGuids } from "../common/utils";

const FailingChecksData = () => {
  const { monitors, loading } = useGuids(FAILED_CHECKS);

  monitors.sort(function (a, b) {   
    return b.failedRate  -  a.failedRate || b.failCount - a.failCount;
});

  const renderTable = () => {
    const renderWarning = (failureRate) => {
      if (failureRate > 0.9) {
        return (
          <Tooltip text="Warning - over 90% failure rate; recommended to fix or disable monitor">
            <Icon
              type={Icon.TYPE.INTERFACE__STATE__WARNING}
              color={"#FFD23D"}
            />
          </Tooltip>
        );
      }
    };

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
                width="40%"
              >
                Monitor Name
              </TableHeaderCell>
              <TableHeaderCell value={({ item }) => item.accountId} width="20%">
                Consuming Account Name
              </TableHeaderCell>
              <TableHeaderCell
                value={({ item }) => item.failedRate}
                width="15%"
              >
                Failure Rate
              </TableHeaderCell>
              <TableHeaderCell value={({ item }) => item.failCount} width="13%">
                Failed Check Count
              </TableHeaderCell>
              <TableHeaderCell
                value={({ item }) => item.totalChecks}
                width="12%"
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
                  {renderWarning(item.failedRate)} {"   "}
                  {item.failedRate}%
                </TableRowCell>
                <TableRowCell>{item.failCount.toLocaleString()}</TableRowCell>
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

export function FailedChecks() {
  return (
    <Grid>
      <GridItem columnSpan={4}>
        <Card
          spacingType={[Card.SPACING_TYPE.LARGE]}
          style={{ backgroundColor: "#F6FAFD" }}
        >
          <CardHeader>
            <HeadingText>
              Billable Checks with the highest failure rates
            </HeadingText>
          </CardHeader>
          <CardBody>
            <HeadingText type={HeadingText.TYPE.HEADING_6}>
              Best Practices:
            </HeadingText>
            <BlockText>
              <ol>
                <li>Fix monitors with high fail rates</li>
                <li>
                  Disable monitors that are running against something that no
                  longer exists
                </li>
              </ol>
            </BlockText>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem columnSpan={8}>
        <></>
      </GridItem>
      <GridItem columnSpan={10}>
        <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
          <CardHeader>
            <HeadingText>Top 50 Failing Checks</HeadingText>
            <BlockText>since 1 month ago</BlockText>
          </CardHeader>
          <CardBody>
            <FailingChecksData />
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
}
