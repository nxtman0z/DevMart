export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateRelative = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now - d) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(date);
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getCategoryColor = (category) => {
  const colors = {
    'UI Kit': 'bg-purple-500/20 text-purple-400',
    'Template': 'bg-blue-500/20 text-blue-400',
    'Boilerplate': 'bg-green-500/20 text-green-400',
    'Snippet': 'bg-amber-500/20 text-amber-400',
    'Tool': 'bg-rose-500/20 text-rose-400',
  };
  return colors[category] || 'bg-gray-500/20 text-gray-400';
};

export const getStarArray = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push('full');
    else if (i - rating < 1) stars.push('half');
    else stars.push('empty');
  }
  return stars;
};
