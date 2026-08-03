const url1 = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const url2 = "https://youtu.be/dQw4w9WgXcQ";
const url3 = "https://www.youtube.com/shorts/dQw4w9WgXcQ";

const getYoutubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

console.log(getYoutubeVideoId(url1));
console.log(getYoutubeVideoId(url2));
console.log(getYoutubeVideoId(url3));
