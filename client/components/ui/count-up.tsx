import { useEffect, useState } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  separator?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 2000,
  decimals = 0,
  separator = ',',
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 50);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [end, duration]);

  const formatNumber = (num: number) => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  };

  return (
    <span className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default CountUp;
