var posts=["2024/Markdown 基本语法/","2024/每一天日落🌇，与美好相遇/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };