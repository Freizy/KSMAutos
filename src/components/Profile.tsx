import React from 'react';
import { User } from 'firebase/auth';
import { UserProfile } from '../types';
import { ShieldCheck, User as UserIcon, Mail, Calendar, Award, Zap, Activity, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileProps {
  user: User;
  profile: UserProfile;
}

export default function Profile({ user, profile }: ProfileProps) {
  return (
    <div className="flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 py-12 border-b border-line">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-2 border-accent p-1">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-muted" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-accent text-bg p-2 rounded-full border-4 border-bg">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest">
            <Award className="w-3 h-3" />
            {profile.role} Member
          </div>
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">{user.displayName}</h2>
          <div className="flex items-center gap-4 text-muted text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Joined {new Date(profile.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Membership Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TierCard 
          active={profile.role === 'user'} 
          title="Standard" 
          price="Free" 
          features={["Inventory Access", "Private Garage", "Technical Specs"]} 
          icon={<Gauge className="w-6 h-6" />}
        />
        <TierCard 
          active={profile.role === 'elite'} 
          title="Elite" 
          price="$99/mo" 
          features={["Priority Pre-orders", "Market Analytics", "Exclusive Auctions"]} 
          icon={<Zap className="w-6 h-6" />}
          accent
        />
        <TierCard 
          active={profile.role === 'admin'} 
          title="KSM Admin" 
          price="N/A" 
          features={["Inventory Management", "User Moderation", "System Access"]} 
          icon={<ShieldCheck className="w-6 h-6" />}
        />
      </div>

      {/* Activity Feed Placeholder */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-bold tracking-tighter uppercase">Recent Activity</h3>
        <div className="flex flex-col border border-line rounded-sm overflow-hidden">
          <ActivityItem icon={<Zap className="w-4 h-4 text-accent" />} label="Vehicle Registered" detail="Hennessey Venom F5 added to garage" time="2 hours ago" />
          <ActivityItem icon={<Activity className="w-4 h-4 text-muted" />} label="Profile Updated" detail="Membership role upgraded to Elite" time="1 day ago" />
          <ActivityItem icon={<Gauge className="w-4 h-4 text-muted" />} label="Login Detected" detail="New session from San Francisco, CA" time="3 days ago" />
        </div>
      </div>
    </div>
  );
}

function TierCard({ active, title, price, features, icon, accent }: { active: boolean, title: string, price: string, features: string[], icon: React.ReactNode, accent?: boolean }) {
  return (
    <div className={`glass p-8 flex flex-col gap-6 relative overflow-hidden ${active ? 'border-accent/50' : ''}`}>
      {active && (
        <div className="absolute top-0 right-0 bg-accent text-bg px-4 py-1 text-[8px] font-black uppercase tracking-widest rotate-45 translate-x-4 translate-y-2">
          Current
        </div>
      )}
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-lg ${accent ? 'bg-accent/20 text-accent' : 'bg-white/5 text-muted'}`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted uppercase tracking-widest font-bold">Tier</div>
          <div className="text-2xl font-black tracking-tighter uppercase">{title}</div>
        </div>
      </div>

      <div className="text-3xl font-mono font-bold tracking-tighter">{price}</div>

      <ul className="flex flex-col gap-3">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-muted">
            <div className="w-1 h-1 bg-accent rounded-full" />
            {f}
          </li>
        ))}
      </ul>

      {!active && (
        <button className="w-full py-3 bg-white/5 border border-line text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all">
          Upgrade Membership
        </button>
      )}
    </div>
  );
}

function ActivityItem({ icon, label, detail, time }: { icon: React.ReactNode, label: string, detail: string, time: string }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-line last:border-0 hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-white/5 rounded-sm">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-muted uppercase tracking-widest font-bold">{label}</span>
          <span className="text-sm font-medium">{detail}</span>
        </div>
      </div>
      <div className="font-mono text-[10px] opacity-30 uppercase">{time}</div>
    </div>
  );
}
