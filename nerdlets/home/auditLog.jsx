import React, { useEffect, useState } from "react";
import {
  BarChart,
  BlockText,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  HeadingText,
  Icon,
  LineChart,
  Link,
  Spinner,
  TableChart,
  Tooltip,
  usePlatformState,
} from "nr1";
import {
  MONTH_CHANGES_OVERVIEW,
  CHANGED_MONITORS,
  TOP_MONTHLY_MODIFIERS,
  DOWNTIME_DATA,
} from "../common/nrqlQueries";

export function AuditLog() {
  const [{ accountId }] = usePlatformState();
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    setLoading(true);
    renderAuditLog(accountId);
    setLoading(false);
  }, [accountId]);

  const renderAuditLog = () => {
    return (
      <>
        <Grid>
          <GridItem columnSpan={4}>
            <Card
              spacingType={[Card.SPACING_TYPE.LARGE]}
              style={{ backgroundColor: "#F6FAFD" }}
            >
              <CardHeader>
                <HeadingText>Auditing Synthetics Monitor Changes</HeadingText>
              </CardHeader>
              <CardBody>
                <BlockText>
                  The queries here are using the NrAuditEvent event. <br />
                  <Link to="https://docs.newrelic.com/docs/data-apis/understand-data/event-data/nrauditevent-event-data-query-examples/">
                    Learn more on our docs.
                  </Link>
                  <br />
                  <br />
                  <HeadingText type={HeadingText.TYPE.HEADING_6}>
                    Use cases:
                  </HeadingText>
                  <ul>
                    <li>
                      Get the bigger picture of monitors changes: creations,
                      deletions, and alterations
                    </li>
                    <li>
                      Identify who your top users are that are making changes to
                      monitors
                    </li>
                    <li>
                      Review monitor downtime periods for your planned outages,
                      SIs, maintenance, etc.
                      <Link to="https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/using-monitors/monitor-downtimes-disable-monitoring-during-scheduled-maintenance-times/">
                        Learn more about how you can use Monitor Downtimes.
                      </Link>
                    </li>
                  </ul>
                </BlockText>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem columnSpan={8}>
            <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
              <CardHeader>
                <HeadingText>Changes by action type</HeadingText>
                <BlockText>since 1 month ago</BlockText>
              </CardHeader>
              <CardBody>
                <LineChart
                  fullWidth
                  accountIds={[accountId]}
                  query={MONTH_CHANGES_OVERVIEW}
                />
              </CardBody>
            </Card>
          </GridItem>

          {/* row 2, 1 item  */}
          <GridItem columnSpan={12}>
            <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
              <CardHeader>
                <HeadingText>Changes by month period</HeadingText>
                <BlockText>limited to 2000 changes</BlockText>
              </CardHeader>
              <CardBody>
                <TableChart
                  fullWidth
                  accountIds={[accountId]}
                  query={CHANGED_MONITORS}
                />
              </CardBody>
            </Card>
          </GridItem>

          {/* row 3, 2 items  */}
          <GridItem columnSpan={6}>
            <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
              <CardHeader>
                <HeadingText>Users making the most changes</HeadingText>
                <BlockText>over the last month</BlockText>
              </CardHeader>
              <CardBody>
                <BarChart
                  fullWidth
                  accountIds={[accountId]}
                  query={TOP_MONTHLY_MODIFIERS}
                />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem columnSpan={6}>
            <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
              <CardHeader>
                <HeadingText>
                  {" "}
                  Monitor Downtime {"  "}
                  <Tooltip text="If you're not seeing data here, it's because no monitor downtime was implemented in this period.">
                    <Icon type={Icon.TYPE.INTERFACE__INFO__INFO} />
                  </Tooltip>
                </HeadingText>
                <BlockText>over the last month</BlockText>
              </CardHeader>
              <CardBody>
                <BarChart
                  fullWidth
                  accountIds={[accountId]}
                  query={DOWNTIME_DATA}
                />
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </>
    );
  };
  return (
    <>
      {/* Loading */}
      {loading && <Spinner />}
      {/* Loaded! */}
      <>{!loading && renderAuditLog()}</>
    </>
  );
}
