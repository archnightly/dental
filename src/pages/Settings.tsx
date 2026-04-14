import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { dataManager } from "@/lib/dataManager";
import { Save, Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const [receptionFee, setReceptionFee] = useState<string>("0");
  const [requirePaymentBeforeAdmit, setRequirePaymentBeforeAdmit] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [fee, requirePay] = await Promise.all([
        dataManager.getSetting("reception_fee"),
        dataManager.getSetting("require_payment_before_admit")
      ]);
      setReceptionFee(fee || "0");
      setRequirePaymentBeforeAdmit(requirePay === "true");
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await Promise.all([
        dataManager.setSetting("reception_fee", receptionFee),
        dataManager.setSetting("require_payment_before_admit", requirePaymentBeforeAdmit.toString())
      ]);
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  if (isLoading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center">
            <SettingsIcon className="mr-3 h-5 w-5 text-primary" />
            Application Settings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Configure clinic rules and fees</p>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm rounded-sm bg-white overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-200 py-3 px-4">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-900">Financial Settings</CardTitle>
          <CardDescription className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">Manage consultation fees and payment rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="receptionFee">Standard Reception Fee ($)</Label>
            <Input
              type="number"
              id="receptionFee"
              value={receptionFee}
              onChange={(e) => setReceptionFee(e.target.value)}
              placeholder="50"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="requirePayment"
              checked={requirePaymentBeforeAdmit}
              onChange={(e) => setRequirePaymentBeforeAdmit(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <Label htmlFor="requirePayment">Require payment/waiver before admitting patient</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-sm h-9 px-4 text-xs font-semibold">
          <Save className="mr-2 h-3.5 w-3.5" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
