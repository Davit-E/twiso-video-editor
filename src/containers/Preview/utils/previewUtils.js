export const generateText = (words) => {
  let text = '';
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    if (word.active && !word.silence) text += `${word.text} `;
  }
  text = text.slice(0, text.length - 1);
  return text;
};

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

export const downloadVideo = (url, title) => {
  let a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `${title}.mp4`);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
