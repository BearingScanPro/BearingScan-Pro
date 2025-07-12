'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const USER_PROFILE_KEY = 'userProfile';

interface UserProfile {
  name: string;
  email: string;
  company: string;
}

export default function ProfilePage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Acme Industries',
  });

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(USER_PROFILE_KEY);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Failed to load profile from localStorage", error);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = () => {
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
       console.error("Failed to save profile to localStorage", error);
       toast({
        variant: "destructive",
        title: "Save Failed",
        description: "There was an error saving your profile. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline">Profile Details</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={profile.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={profile.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={profile.company} onChange={handleInputChange} />
            </div>
            <Button className="w-full" onClick={handleSaveChanges}>Save Changes</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
