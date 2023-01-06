import { useEffect } from "react";
import { Tabs, TabsItem, nerdlet } from "nr1";
import NoAlerts from "./noAlerts";
import { FailedChecks } from "./failedChecks";
import { HighestChecks } from "./highestChecks";
import { LowestChecks } from "./lowestChecks";
import { AuditLog } from "./auditLog";
import { Overview } from "./overview";
export default () => {
  useEffect(() => {
    nerdlet.setConfig({
      accountPicker: true,
      timePicker: false,
    });
  }, []);
  return (
    <Tabs defaultValue="tab-3">
      <TabsItem value="tab-0" label="Usage Overview">
        <Overview />
      </TabsItem>
      <TabsItem value="tab-1" label="Most non-ping checks">
        <HighestChecks />
      </TabsItem>
      <TabsItem value="tab-2" label="No alerts">
        <NoAlerts />
      </TabsItem>
      <TabsItem value="tab-3" label="High failure rates">
        <FailedChecks />
      </TabsItem>
      <TabsItem value="tab-4" label="Low non-ping checks">
        <LowestChecks />
      </TabsItem>
      <TabsItem value="tab-5" label="Audit Log">
        <AuditLog />
      </TabsItem>
    </Tabs>
  );
};
