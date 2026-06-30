const pad = (value: number) => String(value).padStart(2, '0');

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayKey = () => toDateKey(new Date());

export const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDateCn = (dateKey: string) => {
  const date = parseDateKey(dateKey);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

export const getWeekday = (dateKey = todayKey()) => parseDateKey(dateKey).getDay();

export const daysBetween = (from: string, to: string) => {
  const start = parseDateKey(from).getTime();
  const end = parseDateKey(to).getTime();
  return Math.floor((end - start) / 86400000);
};

export const getProgramWeek = (startDate: string, dateKey = todayKey()) =>
  Math.max(1, Math.floor(daysBetween(startDate, dateKey) / 7) + 1);

export const getProgramStage = (week: number) => {
  if (week <= 2) return '第1-2周适应期';
  if (week <= 6) return '第3-6周正式减脂期';
  if (week <= 10) return '第7-10周强化期';
  if (week === 11) return '第11周减量恢复周';
  if (week === 12) return '第12周复盘周';
  return '12周后维持与复盘期';
};

export const getDateRange = (days: number, endDate = todayKey()) => {
  const end = parseDateKey(endDate);
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(end);
    date.setDate(end.getDate() - (days - 1 - index));
    return toDateKey(date);
  });
};
