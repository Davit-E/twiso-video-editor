export const exportText = (text, title) => {
  let a = document.createElement('a');
  a.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  );
  a.setAttribute('download', title);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
