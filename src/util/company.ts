export function matchTickerToCompanyName(ticker: string) {
  if (ticker.trim().toUpperCase() === 'DIS') {
    return '월트 디즈니';
  } else if (ticker.trim() === '035760') {
    return 'CJ ENM';
  } else if (ticker.trim() === '086980') {
    return '쇼박스';
  } else if (ticker.trim() === '023530') {
    return '롯데쇼핑';
  } else if (ticker.trim().toUpperCase() === 'WBD') {
    return '워너 브라더스 디스커버리';
  } else return ticker.trim();
}
