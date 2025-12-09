const helpers = {
  formatPrice: (price) => {
    const value = Number(price) || 0;

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  },

  formatDate: (date) => {
    if (!date) return '';

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) return date;

    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'UTC',
    }).format(dateObj);
  },
  eq: (a, b) => a === b,

  calculateDiscount: (price, discountPercent) => {
    if (!price) return 'R$ 0,00';
    if (!discountPercent) return helpers.formatPrice(price);

    const finalPrice = price - price * (discountPercent / 100);
    return helpers.formatPrice(finalPrice);
  },

  getStatusClass: (status) => {
    switch (status) {
      case 'aprovado':
        return 'bg-success';
      case 'pendente':
        return 'bg-warning';
      case 'rejeitado':
        return 'bg-danger';
      case 'ativo':
        return 'bg-success';
      case 'inativo':
        return 'bg-secondary';
      default:
        return 'bg-primary';
    }
  },

  truncate: (str, len) => {
    if (str && str.length > len && str.length > 0) {
      return new String(str).substring(0, len) + '...';
    }
    return str;
  },

  mult: (a, b) => a * b,

  json: (context) => {
    try {
      return JSON.stringify(context);
    } catch {
      return '{}';
    }
  },
};

export default helpers;
