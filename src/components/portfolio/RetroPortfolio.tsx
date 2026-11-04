'use client';

import React from 'react';
import { OriginalHackathonPortfolio } from './OriginalHackathonPortfolio';
import { AppIconId } from '@/components/icons/AppIcons';

interface RetroPortfolioProps {
  onOpenApp?: (appId: AppIconId) => void;
}

export function RetroPortfolio({ onOpenApp }: RetroPortfolioProps) {
  return <OriginalHackathonPortfolio />;
}
