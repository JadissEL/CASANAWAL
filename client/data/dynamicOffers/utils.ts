// Utility to get current season
export const getCurrentSeason = (): 'ramadan' | 'summer' | 'winter' | 'default' => {
  const month = new Date().getMonth() + 1; // 1-12

  // This would need to be adjusted based on actual Ramadan dates
  // For demo purposes, assuming Ramadan could be in spring months
  if (month >= 3 && month <= 5) {
    return 'ramadan';
  } else if (month >= 6 && month <= 8) {
    return 'summer';
  } else if (month >= 12 || month <= 2) {
    return 'winter';
  }

  return 'default';
};

// Featured items IDs (can be updated based on business logic)
export const getFeaturedItems = (): string[] => {
  return [
    'tajine-poulet-olives',
    'couscous-royal',
    'bastilla-poulet',
    'rfissa',
    'tanjia-marrakchia'
  ];
};
