
import React from 'react';

export const REDEEM_CODES: Record<string, number> = {
  'GAMERBOYFAHMI': 3000,
  'OMNI': 3000,
  'HASAN': 3000,
  'SPARK_ART': 500
};

export const BETA_COST_PER_MESSAGE = 10;
export const BETA_MIN_COINS_REQUIRED = 50;
export const SKRIPTER_COST_PER_MESSAGE = 50;
export const ARTIST_COST_PER_MESSAGE = 100;

export const SKRIPT_ADDONS = [
  'SkQuery', 'SkRayFall', 'TuSke', 'vixio', 'SkBee', 'skDragon', 'Skellett', 'MundoSK', 'skUtilities'
];

export interface PromptTemplate {
  id: string;
  category: 'Marketing' | 'Coding' | 'Writing' | 'Academic' | 'Skript' | 'Art';
  icon: 'marketing' | 'code' | 'writing' | 'academic' | 'rocket' | 'sparkles';
  title: string;
  prompt: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'art-1',
    category: 'Art',
    icon: 'sparkles',
    title: 'Cyberpunk City',
    prompt: 'A high-detail cyberpunk city with neon lights and flying cars, rainy atmosphere, 4k cinematic lighting.'
  },
  {
    id: 'sk-1',
    category: 'Skript',
    icon: 'code',
    title: 'Basic Admin GUI',
    prompt: 'Create a Minecraft Skript for an Admin GUI that allows staff to kick, ban, and mute players using an inventory interface.'
  },
  {
    id: 'sk-addon-1',
    category: 'Skript',
    icon: 'code',
    title: 'Vixio Discord Bot',
    prompt: 'Create a Skript using the vixio addon that connects a Minecraft chat to a Discord channel, including a status command.'
  },
  {
    id: 'mkt-1',
    category: 'Marketing',
    icon: 'marketing',
    title: 'Viral Thread',
    prompt: 'Write a viral Twitter thread about 5 AI productivity tools that save 10+ hours a week. Include hooks and hashtags.'
  },
  {
    id: 'code-1',
    category: 'Coding',
    icon: 'code',
    title: 'Code Refactor',
    prompt: 'Refactor the following code to be more efficient, readable, and follow modern best practices.'
  }
];

export const SparkLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="50%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#d946ef" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path 
      d="M20,50 C20,30 50,20 80,45 C80,65 50,85 20,50 Z" 
      fill="url(#logoGradient)" 
      filter="url(#glow)"
      style={{
        transform: 'rotate(-15deg)',
        transformOrigin: 'center'
      }}
    />
    <path 
      d="M30,55 C30,40 50,35 70,50 C70,60 50,70 30,55 Z" 
      fill="white" 
      fillOpacity="0.4"
    />
  </svg>
);
