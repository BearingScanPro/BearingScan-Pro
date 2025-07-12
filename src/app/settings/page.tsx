'use client';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline">Application Settings</CardTitle>
            <CardDescription>Configure camera, alerts, and model parameters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Camera</h3>
                 <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                        <Label>Default Camera</Label>
                        <p className="text-sm text-muted-foreground">
                            Choose front or rear camera for inspections.
                        </p>
                    </div>
                    <Select defaultValue="environment">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select camera" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="environment">Rear Camera</SelectItem>
                            <SelectItem value="user">Front Camera</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </div>
             <div className="space-y-4">
                <h3 className="text-lg font-medium">Alerts</h3>
                 <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                         <p className="text-sm text-muted-foreground">
                           Receive an email for defective products.
                        </p>
                    </div>
                    <Switch defaultChecked={true} />
                 </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-medium">AI Model</h3>
                 <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                        <Label>Model Version</Label>
                        <p className="text-sm text-muted-foreground">
                            Select the AI model for analysis.
                        </p>
                    </div>
                    <Select defaultValue="gemini-2.0-flash">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                            <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </div>
            <Button className="w-full">Save Settings</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
