"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Share2, Trophy, Scissors, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const POINTS_TIERS = [
  { name: "Bronze", points: 1000, color: "bg-orange-500" },
  { name: "Silver", points: 2500, color: "bg-gray-400" },
  { name: "Gold", points: 5000, color: "bg-yellow-500" },
  { name: "Platinum", points: 10000, color: "bg-blue-500" },
];

export default function ReferralProgram() {
  const [email, setEmail] = useState("");
  const currentPoints = 1500; // This would come from your backend
  const nextTier = POINTS_TIERS.find(tier => tier.points > currentPoints) || POINTS_TIERS[POINTS_TIERS.length - 1];
  const currentTier = POINTS_TIERS.find(tier => tier.points > currentPoints) 
    ? POINTS_TIERS[POINTS_TIERS.findIndex(tier => tier.points > currentPoints) - 1]
    : POINTS_TIERS[POINTS_TIERS.length - 1];
  
  const progressToNextTier = currentTier === POINTS_TIERS[POINTS_TIERS.length - 1]
    ? 100
    : ((currentPoints - (currentTier?.points || 0)) / (nextTier.points - (currentTier?.points || 0))) * 100;

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Invitation sent!", {
        description: "Your friend will receive an email with your referral link.",
      });
      setEmail("");
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Referral Program</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Invite friends and earn points for your next haircut
        </p>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                {currentTier.name} Member
              </CardTitle>
              <CardDescription>
                {nextTier === currentTier 
                  ? "You've reached the highest tier!" 
                  : `${nextTier.points - currentPoints} points until ${nextTier.name}`}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{currentPoints}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progressToNextTier} className="h-2" />
            <div className="flex justify-between text-sm">
              {POINTS_TIERS.map((tier, index) => (
                <div 
                  key={tier.name}
                  className={`flex flex-col items-center ${
                    currentPoints >= tier.points ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    currentPoints >= tier.points ? tier.color : "bg-muted"
                  }`} />
                  <span className="mt-1">{tier.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary/5 border-none">
          <CardHeader>
            <Share2 className="h-5 w-5 mb-2 text-primary" />
            <CardTitle className="text-sm">Refer Friends</CardTitle>
            <CardDescription>
              Share your unique referral link
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-primary/5 border-none">
          <CardHeader>
            <Scissors className="h-5 w-5 mb-2 text-primary" />
            <CardTitle className="text-sm">They Book</CardTitle>
            <CardDescription>
              Friends book their first cut
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-primary/5 border-none">
          <CardHeader>
            <Trophy className="h-5 w-5 mb-2 text-primary" />
            <CardTitle className="text-sm">Earn Points</CardTitle>
            <CardDescription>
              Get 500 points per referral
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Rewards</CardTitle>
          <CardDescription>
            Redeem your points for these exclusive rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {[
              { name: "Free Haircut", points: 2000, available: currentPoints >= 2000 },
              { name: "Premium Hair Product", points: 1500, available: currentPoints >= 1500 },
              { name: "VIP Treatment", points: 3000, available: currentPoints >= 3000 },
            ].map((reward) => (
              <div
                key={reward.name}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium">{reward.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {reward.points} points
                  </p>
                </div>
                <Button
                  variant={reward.available ? "default" : "outline"}
                  disabled={!reward.available}
                >
                  {reward.available ? "Redeem" : "Not Available"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invite Friends</CardTitle>
          <CardDescription>
            Send invites to your friends and family
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="flex gap-2">
            <Input
              type="email"
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit">Send Invite</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}