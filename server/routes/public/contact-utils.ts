// =====================================================
// CONTACT UTILITIES (≤150 lines)
// =====================================================

const DEFAULT_OPENING_HOURS = {
  monday: { open: "11:00", close: "22:00", closed: false },
  tuesday: { open: "11:00", close: "22:00", closed: false },
  wednesday: { open: "11:00", close: "22:00", closed: false },
  thursday: { open: "11:00", close: "22:00", closed: false },
  friday: { open: "11:00", close: "22:00", closed: false },
  saturday: { open: "11:00", close: "23:00", closed: false },
  sunday: { open: "12:00", close: "22:00", closed: false }
};

export const isRestaurantOpen = (): boolean => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en', { weekday: 'long' }).toLowerCase();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const todayHours = DEFAULT_OPENING_HOURS[currentDay as keyof typeof DEFAULT_OPENING_HOURS];
  
  if (!todayHours || todayHours.closed) {
    return false;
  }
  
  const openTime = parseInt(todayHours.open.split(':')[0]) * 60 + parseInt(todayHours.open.split(':')[1]);
  const closeTime = parseInt(todayHours.close.split(':')[0]) * 60 + parseInt(todayHours.close.split(':')[1]);
  
  return currentTime >= openTime && currentTime <= closeTime;
};

export const getNextOpeningTime = (): string | null => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en', { weekday: 'long' }).toLowerCase();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const todayHours = DEFAULT_OPENING_HOURS[currentDay as keyof typeof DEFAULT_OPENING_HOURS];
  
  if (todayHours && !todayHours.closed) {
    const openTime = parseInt(todayHours.open.split(':')[0]) * 60 + parseInt(todayHours.open.split(':')[1]);
    
    if (currentTime < openTime) {
      return todayHours.open;
    }
  }
  
  return null;
};
