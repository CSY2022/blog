var posts=["2025/Markdown语法指南/","2025/每一天日落，与美好相遇/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };