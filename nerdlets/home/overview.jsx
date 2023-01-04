import React, { useState, useEffect } from "react";
import {
  BillboardChart,
  BlockText,
  Card,
  CardHeader,
  CardBody,
  Grid,
  GridItem,
  HeadingText,
  Icon,
  LineChart,
  Link,
  PieChart,
  Spinner,
  TableChart,
  Tooltip,
  usePlatformState,
} from "nr1";
import {
  CHECKS_BY_ACCT,
  CHECKS_BY_TYPE,
  FREE_PINGS,
  SIX_MONTH_TREND,
  TIMESERIES_COMPARISON,
  TOTAL_CHECKS,
} from "../common/nrqlQueries";

export const Overview = () => {
  const [{ accountId }] = usePlatformState();
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    setLoading(true);
    renderOverview(accountId);
    setLoading(false);
  }, [accountId]);

  const renderOverview = () => {
    return (
      <Grid>
        {/* row 1 - 3 items*/}
        <GridItem columnSpan={4}>
          <Card
            spacingType={[Card.SPACING_TYPE.LARGE]}
            fullWidth
            style={{ backgroundColor: "#F6FAFD" }}
          >
            <CardHeader>
              <HeadingText>Synthetics Usage Overview</HeadingText>
            </CardHeader>
            <CardBody>
              <BlockText>
                Review information to get a picture of your synthetics usage.
                <br />
                <br />
                New Relic offers unlimited Ping Checks; all other types count
                towards a monthly subscription cap.
                <br />
                <br />
                <Link to="https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/getting-started/types-synthetic-monitors/">
                  Learn more about New Relic Synthetics monitor types
                </Link>
                <br />
                <br />
                <Link to="https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/getting-started/monitor-limits/">
                  Learn more about your monitor limits
                </Link>
              </BlockText>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem columnSpan={4}>
          <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
            <CardHeader>
              <HeadingText>Total Billable Checks</HeadingText>
              since 1 month ago compared with a week ago
            </CardHeader>
            <CardBody>
              <BillboardChart accountIds={[accountId]} query={TOTAL_CHECKS} />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem columnSpan={4}>
          <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
            <CardHeader>
              <HeadingText>Total Free Ping Checks</HeadingText>
              since 1 month ago compared with a week ago
            </CardHeader>
            <CardBody>
              <BillboardChart accountIds={[accountId]} query={FREE_PINGS} />
            </CardBody>
          </Card>
        </GridItem>
        {/* row 2 - 2 items */}
        <GridItem columnSpan={6}>
          <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
            <CardHeader>
              <HeadingText>Daily Usage chart</HeadingText>
              since 1 month ago
            </CardHeader>
            <CardBody>
              <LineChart
                fullWidth
                accountIds={[accountId]}
                query={TIMESERIES_COMPARISON}
              />
            </CardBody>
          </Card>
        </GridItem>{" "}
        <GridItem columnSpan={6}>
          <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
            <CardHeader>
              <HeadingText>Billable Checks by Monitor Type</HeadingText>
            </CardHeader>
            <CardBody>
              <PieChart
                fullWidth
                accountIds={[accountId]}
                query={CHECKS_BY_TYPE}
              />
            </CardBody>
          </Card>
        </GridItem>
        {/* column 3 - 2 items */}
        <GridItem columnSpan={6}>
          <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
            <CardHeader>
              <HeadingText>Billable Checks by Account</HeadingText>
            </CardHeader>
            <CardBody>
              <TableChart
                style={{ height: "500px" }}
                fullWidth
                accountIds={[accountId]}
                query={CHECKS_BY_ACCT}
              />
            </CardBody>
          </Card>
        </GridItem>{" "}
        <GridItem columnSpan={6}>
          <Card spacingType={[Card.SPACING_TYPE.LARGE]}>
            <CardHeader>
              <HeadingText>
                Six Month Usage Trends {"  "}
                <Tooltip text="Note: this is looking back exactly 6 months; the leading and trailing months will be partial counts for that month.">
                  <Icon type={Icon.TYPE.INTERFACE__INFO__INFO} />
                </Tooltip>
              </HeadingText>
            </CardHeader>
            <CardBody>
              <TableChart
                fullWidth
                style={{ height: "500px" }}
                accountIds={[accountId]}
                query={SIX_MONTH_TREND}
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    );
  };

  return (
    <>
      {/* Loading */}
      {loading && <Spinner />}
      {/* Loaded! */}
      <>{!loading && renderOverview()}</>
    </>
  );
};
